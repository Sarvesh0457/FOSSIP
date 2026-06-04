import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginSignup({ isLoginMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? 'login' : 'signup';
    
    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting server");
    }
  };

  return (
    <div>
      <h2>{isLoginMode ? 'Login' : 'Signup'} (Demo Form)</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required /><br/><br/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br/><br/>
        <button type="submit">{isLoginMode ? 'Login' : 'Signup'}</button>
      </form>
    </div>
  );
}

export default LoginSignup;