import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Adjust the path if needed
import DefaultLayout from './layouts/DefaultLayout';


// Import your main page components
// import HomePage from './pages/HomePage'; // Commented out as in your code
import PricingPage from './pages/Pricing/PricingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ShippingPage from './pages/Checkout/ShippingPage';
import PaymentPage from './pages/Checkout/PaymentPage'; // PaymentPage is imported
import './index.css'; // Global CSS import

function App() {
  return (
    <AuthProvider> {/* AuthProvider wraps the entire app */}
      <Router> {/* Router for navigation */}
        <Routes> {/* Defines the available routes */}

          {/* Route for pages that use the DefaultLayout (with Navbar and Footer) */}
          {/* Nested routes rendered within the DefaultLayout component */}
          <Route element={<DefaultLayout />}>
            {/* Nested routes using DefaultLayout */}
            {/* <Route path="/" element={<HomePage />} /> */} {/* Example commented route */}
            <Route path="/profile" element={<PricingPage />} /> {/* Pricing page route */}
            <Route path="/checkout/shipping" element={<ShippingPage />} /> {/* Shipping page route */}
            <Route path="/checkout/payment" element={<PaymentPage />} /> 
            {/* Add other routes that need Navbar/Footer here */}
            {/* Example: <Route path="/about" element={<AboutPage />} /> */}
          </Route>

          {/* Routes for pages that DO NOT use the DefaultLayout (like Login, Signup) */}
          <Route path="/login" element={<LoginPage />} /> {/* Login page route */}
          <Route path="/signup" element={<SignupPage />} /> {/* Signup page route */}

          {/* Optional: Add a catch-all route for 404 Not Found pages */}
          {/* import NotFoundPage from './pages/NotFoundPage'; */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
