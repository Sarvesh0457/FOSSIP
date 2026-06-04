import './App.css'
import { Link, Outlet } from 'react-router-dom'
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
      <div className="app-container">
        <nav style={{ padding: '10px', background: 'lightgray', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About App</Link>
          
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px', alignItems: 'center' }}>
            {user ? (
              <>
                <span>Logged in as: <strong>{user.email}</strong></span>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
        </nav>

        <main style={{ padding: '20px' }}>
          <Outlet />
        </main>

        <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc', padding: '10px' }}>
          <p>© 2026 My Vite Project</p>
        </footer>
      </div>
  )
}

export default App;