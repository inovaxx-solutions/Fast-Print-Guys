import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CheckoutConfirmation.css';

const CheckoutConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Verifying payment…');
  const [errorMessage, setErrorMessage] = useState(null);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const paypalFlag = searchParams.get('paypal');
    const paypalToken = searchParams.get('token');
    const orderId = searchParams.get('orderId');

    // 1) Stripe confirmation
    if (sessionId) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/order/stripe-complete`, {
          sessionId
        })
        .then((res) => {
          // server returns { success: true, order }
          const order = res.data.order;
          setDetails({
            id:       order._id,
            amount:   order.total.toFixed(2),
            currency: 'USD',
            method:   'Stripe',
            orderId:  order._id,
            date:     new Date(order.createdAt).toLocaleString()
          });
          setStatusMessage('✅ Payment successful via Stripe! 🎉');
        })
        .catch((err) => {
          console.error('Stripe confirmation failed:', err);
          setErrorMessage('Stripe payment verification failed.');
          setStatusMessage(null);
        });
      return;
    }

    // 2) PayPal capture via token
    if (paypalToken && orderId) {
      // By the time this runs, our /api/order/paypal-capture route (server-side)
      // already flipped status to "paid".
      setDetails({
        id:       orderId,
        amount:   'N/A',      // Optionally fetch actual amount via another endpoint
        currency: 'USD',
        method:   'PayPal',
        orderId,
        date:     new Date().toLocaleString()
      });
      setStatusMessage('✅ Payment successful via PayPal! 🎉');
      return;
    }

    // 3) Fallback for redirect-only PayPal (no token)
    if (paypalFlag === 'true' && orderId) {
      setDetails({ orderId });
      setStatusMessage('✅ Payment successful via PayPal! 🎉');
      return;
    }

    // 4) No known params
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

        {details && (
          <div className="confirmation-details">
            <div className="detail-row">
              <span className="label">Order ID:</span>
              <span className="value">{details.orderId || details.id}</span>
            </div>
            <div className="detail-row">
              <span className="label">Amount Paid:</span>
              <span className="value">
                {details.currency} ${details.amount}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Method:</span>
              <span className="value">{details.method}</span>
            </div>
            <div className="detail-row">
              <span className="label">Date:</span>
              <span className="value">{details.date}</span>
            </div>
          </div>
        )}

        <Link to="/pricing" className="btn btn-return">
          ← Return to Pricing
        </Link>
      </div>
    </div>
  );
};

export default CheckoutConfirmation;
