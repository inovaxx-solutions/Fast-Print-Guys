// src/pages/Auth/components/LoginForm/LoginForm.jsx
import React, { useState } from 'react';
import './LoginForm.css';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../../services/authService'; // Import the login function

// Import the useAuth hook to consume the Authentication Context
import { useAuth } from '../../../../contexts/AuthContext.jsx'; // Adjust the path and extension if needed


function LoginForm() {
  // --- Consume Authentication Context ---
  // Get the login function from the context
  const { login: authLogin } = useAuth(); // Get the login function provided by AuthContext

  // --- State for form inputs ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- State for UI features ---
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // --- State for API call status ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // Removed success state as context update and redirect usually handle success indication

  // --- Hook for programmatic navigation ---
  const navigate = useNavigate();


  // --- Handlers for input changes ---
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  // --- Handler for password visibility toggle ---
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // --- Handler for "Keep Logged In" checkbox ---
  const handleKeepLoggedInChange = (e) => {
    setKeepLoggedIn(e.target.checked);
  };

  // --- Handler for form submission (Integrates API Call and Context Update) ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await login({ email, password }); // Call the login function
      // Store the token in localStorage or state management
      localStorage.setItem('authToken', response.token); // Store the token
      // Call the login method from AuthContext
      await authLogin(response.token, response.user); // Ensure this matches your API response
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin'); // Redirect to admin page
      } else {
        navigate('/profile'); // Redirect to user profile
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="login-form-container">
      {/* Welcome Message */}
      <h2 className="welcome-heading">
        Welcome back <span role="img" aria-label="waving hand">👋</span>
      </h2>

      {/* Form Subheading */}
      <h3 className="login-subheading">Login Your Account</h3>

      {/* Error Message Display */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={handleEmailChange}
            placeholder="your.email@example.com"
            aria-label="Email Address"
          />
        </div>

        {/* Password Input with Icons */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              aria-label="Password"
            />
            <span
              className="icon toggle-password-icon"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && togglePasswordVisibility()}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Keep Logged In & Forgot Password Row */}
        <div className="form-options">
          <label className="remember-me">
            <input
              id="keep-logged-in"
              name="keep-logged-in"
              type="checkbox"
              checked={keepLoggedIn}
              onChange={handleKeepLoggedInChange}
            />
            Keep Me Logged In
          </label>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password
          </Link>
        </div>

        <div className="form-group">
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="signup-text">
        Don't Have An Account?{' '}
        <Link to="/signup" className="signup-link">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;