import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './Home.jsx'
import About from './About.jsx'
import LoginSignup from './LoginSignup.jsx'
import { AuthProvider } from './AuthContext.jsx'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
  { 
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'login',
        element: <LoginSignup isLoginMode={true} />
      },
      {
        path: 'signup',
        element: <LoginSignup isLoginMode={false} />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)