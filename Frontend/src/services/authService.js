// src/services/authService.js
import api from './api'; // Import the configured Axios instance from your api.js

/**
 * Sends user registration data to the backend API.
 * @param {Object} userData - Object containing user registration details (e.g., { username, email, password }).
 * @returns {Promise<Object>} A promise that resolves with the API response data upon successful registration.
 */
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    console.log('Signup successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Signup failed:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Sends user login credentials to the backend API.
 * @param {Object} credentials - Object containing user login credentials (e.g., { email, password }).
 * @returns {Promise<Object>} A promise that resolves with the API response data upon successful login.
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

// You could add other authentication-related API calls here (e.g., logout, password reset)
// export const logout = async () => { /* ... */ };