import './App.css'
import { Link, Outlet } from 'react-router-dom'
import React from 'react';
import Home from './Home.jsx'
import About from './About.jsx'

function App() {
  return (
      <div className="app-container">
        {/* This Navbar stays visible on EVERY single page */}
        <nav style={{ padding: '10px', background: 'lightgray', display: 'flex', gap: '15px' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About App</Link>
        </nav>

        {/* The Main Content Area */}
        <main style={{ padding: '20px' }}>
          <Outlet />
        </main>

        {/* This Footer also stays visible on EVERY single page */}
        <footer style={{ marginTop: '20px', borderTop: '1px solid #ccc', padding: '10px' }}>
          <p>© 2026 My Vite Project</p>
        </footer>
      </div>
  )
}

export default App
