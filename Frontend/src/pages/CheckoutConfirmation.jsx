// src/pages/CheckoutConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CheckoutConfirmation.css';

const CheckoutConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Verifying payment...');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paypalFlag = searchParams.get('paypal');
    const orderId = searchParams.get('orderId');

    // 1) If Stripe returned us with ?session_id=…, finalize payment on backend
    if (sessionId) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/order/stripe-complete`, {
          sessionId: sessionId,
        })
        .then((res) => {
          if (res.data && res.data.success) {
            setStatusMessage('Payment successful! 🎉');
          } else {
            setStatusMessage('Payment verified. Please check your order status.');
          }
        })
        .catch((err) => {
          console.error('Error completing Stripe payment:', err);
          setErrorMessage(
            err.response?.data?.error || 'Failed to verify payment. Please contact support.'
          );
          setStatusMessage(null);
        });
      return;
    }

    // 2) If PayPal redirected us here with ?paypal=true&orderId=…, backend already marked it paid
    if (paypalFlag === 'true' && orderId) {
      setStatusMessage('Payment successful via PayPal! 🎉');
      return;
    }

    // 3) Otherwise, show a default message
    setStatusMessage('Payment complete!');
  }, [searchParams]);

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="confirmation-icon" style={{ fontSize: '60px' }}>✅</div>
        {statusMessage && <h1>{statusMessage}</h1>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <p className="subtitle">
          {statusMessage
            ? "Thank you for your order! We'll process it shortly."
            : 'There was an issue verifying your payment.'}
        </p>

        <Link to="/pricing" className="btn btn-return">
          ← Return to Pricing
        </Link>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
