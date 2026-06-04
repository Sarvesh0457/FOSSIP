const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;
const JWT_SECRET = "asb2hdchHBbquCA5k16bFSD8dkHjbcak";

app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory database for demo purposes
const users = [];

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Fields cannot be empty" });

        const userExists = users.find(u => u.email === email);
        if (userExists) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now(), email, password: hashedPassword };
        users.push(newUser);

        // Generate token immediately on signup
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { email: newUser.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { email: user.email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 3. JWT Verification Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Access Denied: No Token Provided" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid or Expired Token" });
        req.user = user;
        next();
    });
};

// 4. Protected Route Demo
app.get('/api/protected-dashboard', authenticateToken, (req, res) => {
    res.json({ message: `Secret data fetched! Welcome back, ${req.user.email}` });
});

app.get("/", (req, res) => {
    res.send("Backend Auth Server is Running!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});