// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
// Corrected: Import fetchLoggedInUser from your api.js file
// Adjust the path '../services/api' if your api.js is not there relative to contexts folder
import { fetchLoggedInUser } from '../services/api'; // <-- Import from api.js

// You might also need the logout API function here if your backend has one and it's in authService.js
// import { logout as logoutApi } from '../services/authService';


// Create the Authentication Context
const AuthContext = createContext({
  // Default context value - will be replaced by the Provider's state/functions
  user: null, // User data (e.g., { id, name, email })
  authToken: null, // The authentication token
  isLoading: true, // To indicate if the initial loading/check is happening
  error: null, // Any error during the initial load
  login: async (token, userData) => {}, // Function to call after successful login API call
  logout: async () => {}, // Function to call to log the user out
  isAuthenticated: false, // Derived state: true if user and token exist
});

// Custom hook to easily consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken')); // Read token from storage on load
  const [isLoading, setIsLoading] = useState(true); // Start as true for initial load check
  const [error, setError] = useState(null);

  // Effect to check for an existing token and fetch user data on app initialization
  useEffect(() => {
    const loadUser = async () => {
      if (authToken) {
        try {
          // Use the service function imported from api.js
          const userData = await fetchLoggedInUser();

          if (userData) {
            setUser(userData);
            console.log('AuthContext: User data loaded from token.');
          } else {
             // Token might be invalid or expired, clear it
             console.log('AuthContext: Token found but failed to fetch user data. Clearing token.');
             setAuthToken(null); // Clear state
             localStorage.removeItem('authToken'); // Remove from storage
          }

        } catch (err) {
          console.error('AuthContext: Error loading user from token:', err);
          // Handle error (e.g., token expired, invalid) by clearing token
          setAuthToken(null); // Clear state
          localStorage.removeItem('authToken'); // Remove from storage
          // Optionally set an error state, but often silently failing is fine here
          // setError('Failed to load user session.');
        }
      }
      setIsLoading(false); // Initial loading is complete
    };

    loadUser();

    // Effect dependencies: Only re-run if authToken changes due to login/logout calls within the app
    // Note: This useEffect is primarily for the *initial* check on app load.
    // The dependency array ensures it reacts if the token is updated by login/logout calls *within this context*.
    // If you have other external ways tokens might change, you might need to adjust.
  }, [authToken]); // Depend on authToken


  // --- Authentication Actions ---

  // Function to update state after successful login API call (called from LoginForm)
  const login = async (token, userData) => {
      // Clear any potential initial loading/error state from the context check
      setIsLoading(false);
      setError(null);

      setAuthToken(token);
      setUser(userData); // Set user data if API returns it
      localStorage.setItem('authToken', token); // Ensure token is in storage

      console.log('AuthContext: User logged in.', { user: userData, token });

      // Optional: If your login API doesn't return user data but fetchLoggedInUser does,
      // you might call fetchLoggedInUser here after setting the token.
      // try {
      //    const fetchedUser = await fetchLoggedInUser();
      //    setUser(fetchedUser);
      //    console.log('AuthContext: Fetched user data after login.');
      // } catch (err) {
      //    console.error('AuthContext: Failed to fetch user data after login:', err);
      //    // Handle error fetching user after login if necessary
      // }
  };

  // Function to log the user out
  const logout = async () => {
    // Optional: Call backend logout API if your backend has one and it's in authService.js
    // try {
    //   await logoutApi();
    //   console.log('AuthContext: Backend logout successful.');
    // } catch (err) {
    //   console.error('AuthContext: Backend logout failed:', err);
    //   // Decide how to handle frontend logout if backend fails
    // } finally { // Always perform frontend logout regardless of backend call success/failure
       setAuthToken(null); // Clear state
       setUser(null); // Clear state
       localStorage.removeItem('authToken'); // Remove token from storage
       setIsLoading(false); // Ensure loading is off
       setError(null); // Clear errors
       console.log('AuthContext: User logged out.');
    // }
  };

  // Derived state for convenience
  // Use a more robust check: true if user is not null AND token is not null/undefined/empty string
  const isAuthenticated = !!(user && authToken);

  // Value provided by the context
  const contextValue = {
    user,
    authToken,
    isLoading,
    error,
    login, // Provide the login function
    logout, // Provide the logout function
    isAuthenticated, // Provide the derived state
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};