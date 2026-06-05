require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('./models/User'); // Import the schema
const app = express();
const port = 3000;

const JWT_SECRET = process.env.JWT_SECRET || "your_demo_jwt_secret_key";
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB Connection Error:", err));

// --- STANDARD AUTH ROUTES ---

app.post('/api/signup', async (req, res) => {
    try {
        const { name, phoneNumber, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            uid: crypto.randomUUID(),
            name,
            phoneNumber,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { email: newUser.email, name: newUser.name } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            return res.status(400).json({ message: "Invalid credentials" }); // Cleaned up message
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { email: user.email, name: user.name } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// --- MIDDLEWARE & TEST ROUTE ---
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user;
        next();
    });
};

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: "You have accessed the protected route!" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});