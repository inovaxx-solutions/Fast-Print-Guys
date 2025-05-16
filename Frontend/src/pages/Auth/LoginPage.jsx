// src/pages/Auth/LoginPage.jsx
import React from 'react';
import LoginForm from './components/LoginForm/LoginForm'; // Import the LoginForm component
import './LoginPage.css'; // Create this CSS file for layout styles
import { Link } from 'react-router-dom'; // Assuming the logo links to home
import logo from '../../assets/logo.png'; // Adjust path to your logo file
import authIllustration from '../../assets/auth-illustration.png';
function LoginPage() {
  return (
    <div className="login-page-wrapper"> {/* Use a wrapper for the full page layout */}
      {/* Left Section - Illustration and Logo */}
      <div className="login-left-panel">
        <div className="login-logo">
          <Link to="/"> {/* Assuming logo links to home */}
            <img src={logo} alt="FastPrint Logo" /> {/* Use your logo image */}
          </Link>
        </div>
        <div className="login-illustration">
          {/* Placeholder for the illustration image */}
          <img src={authIllustration} alt="Auth Illustration" />
          {/* Replace src with the actual path to your illustration image */}
        </div>
      </div>

      {/* Right Section - Login Form Area */}
      <div className="login-right-panel">
         {/* Render the LoginForm component within the right panel */}
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;