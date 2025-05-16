// src/pages/Auth/components/SignupForm/SignupForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupForm.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signup } from '../../../../services/authService'; // Import the signup function


function SignupForm() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- State for API call status ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
   // You could add a success message state here if you want to show a message before redirecting
   // const [successMessage, setSuccessMessage] = useState(null);

  // Use the useNavigate hook for navigation
  const navigate = useNavigate();

  // --- Event Handlers ---
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
    if (error) setError(null);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (error) setError(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // --- Handler for form submission (Includes Validation and API Call) ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous states
    setIsLoading(true);
    setError(null);
   // setSuccessMessage(null); // Clear success message too if using one

    // --- Basic Frontend Validation ---
    if (!userName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and Confirm Password do not match.');
      setIsLoading(false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    console.log('Attempting signup with:', { userName, email }); // Don't log password

    // --- API Integration ---
    try {
      // Call the signup API service function using Axios
      const response = await signup({ userName, email, password }); // Call the signup function

      // --- Handle successful signup ---
      console.log('Signup successful:', response);

      // Optional: Set success message state here if you want to display one
      // setSuccessMessage('Registration successful! Please log in.');

      // Typically, after successful signup, you redirect to the login page
      console.log('Signup successful, navigating to login...');
      navigate('/login'); // Redirect to the login page

      // TODO: Depending on backend flow, you might automatically log them in here
      // using the login API call and then update AuthContext, followed by redirecting to home/dashboard.
      // If auto-login is desired, the logic would be similar to the LoginForm's handleSubmit success block.


    } catch (err) {
      // --- Handle signup errors ---
      console.error('Signup failed:', err);
      setError('Signup failed. Please check your details and try again.');
    } finally {
      setIsLoading(false); // Turn off loading state
    }
    // --- End API Integration ---
  };

  // --- JSX Rendering ---
  return (
    // Reuse the container class for styling consistency with LoginForm
    <div className="login-form-container">
      {/* Signup Page Heading */}
      <h2 className="signup-heading">Sign Up Now</h2>

      {/* Error Message Display */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Optional Success Message Display */}
      {/* {successMessage && (
          <div className="success-message" role="status">
              {successMessage}
          </div>
      )} */}

      {/* Signup Form */}
      <form className="login-form" onSubmit={handleSubmit}>
        {/* User Name Input */}
        <div className="form-group">
          <label htmlFor="userName">User Name</label>
          <input
            id="userName"
            name="userName"
            type="text"
            autoComplete="name"
            required
            value={userName}
            onChange={handleUserNameChange}
            placeholder="john"
            aria-label="User Name"
          />
        </div>

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
              autoComplete="new-password"
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

        {/* Confirm Password Input with Icons */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="**********"
              aria-label="Confirm Password"
            />
            <span
              className="icon toggle-password-icon"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleConfirmPasswordVisibility()}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* Sign Up Button */}
        <div className="form-group">
             <button
                type="submit"
                disabled={isLoading}
                className="login-button" // Reuse login button class for styling
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </button>
        </div>

      </form>

      {/* Login Link */}
      <p className="signup-text">
        Already Have An Account?{' '}
        <Link to="/login" className="signup-link">
          Login
        </Link>
      </p>
    </div>
  );
}

export default SignupForm;