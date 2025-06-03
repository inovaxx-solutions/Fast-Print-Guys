// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import DefaultLayout from './layouts/DefaultLayout';

// … your existing imports …
import PricingPage from './pages/Pricing/PricingPage';
import AdminOrders from './pages/Admin/AdminOrders.jsx';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ShippingPage from './pages/Checkout/ShippingPage';
import PaymentPage from './pages/Checkout/PaymentPage';
import CheckoutConfirmation from './pages/CheckoutConfirmation';
import RedirectToFastPrintGuys from './RedirectToFastPrintGuys'; // <— import it here

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 1) Add "/" route before others so it immediately redirects out */}
          <Route path="/" element={<LoginPage />} />

          {/* 2) All routes under DefaultLayout */}
          <Route element={<DefaultLayout />}>
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/checkout/shipping" element={<ShippingPage />} />
            <Route path="/checkout/payment" element={<PaymentPage />} />
            <Route path="/checkout/confirmation" element={<CheckoutConfirmation />} />
            <Route path="/admin" element={<AdminOrders />} />
          </Route>

          {/* 3) Auth‐less routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* (Optional) 404 catch‐all can go here */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
