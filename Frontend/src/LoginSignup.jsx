import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginSignup({ isLoginMode }) {
  const [formData, setFormData] = useState({ name: '', phoneNumber: '', email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLoginMode ? 'login' : 'signup';
    
    try {
      const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.user, data.token);
        navigate('/');
      } else {
        alert(data.message || "Authentication failed");
      }
    } catch (err) {
        alert("Error contacting server");
    }
  };

  return (
    <div>
      <h2>{isLoginMode ? 'Login' : 'Signup'}</h2>
      
      <form onSubmit={handleSubmit}>
        {!isLoginMode && (
            <>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required /><br/><br/>
                {/* Added 'required' here to match the User.js schema requirement */}
                <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required /><br/><br/>
            </>
        )}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br/><br/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br/><br/>
        <button type="submit">{isLoginMode ? 'Login' : 'Signup'}</button>
      </form>
    </div>
  );
}

export default LoginSignup;