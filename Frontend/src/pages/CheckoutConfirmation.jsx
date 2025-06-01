import React from 'react';
import { Link } from 'react-router-dom';
import './CheckoutConfirmation.css';

const CheckoutConfirmation = () => {
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
          <div className="confirmation-icon" style={{ fontSize: '60px' }}>✅</div>
              <h1>Payment Successful 🎉</h1>
        <p className="subtitle">Thank you for your order! We've received your payment and will process it shortly.</p>

        <Link to="/pricing" className="btn btn-return">
          ← Return to Pricing
        </Link>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
