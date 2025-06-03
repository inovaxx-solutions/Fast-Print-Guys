import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './CheckoutConfirmation.css';

const CheckoutConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Verifying payment...');
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
        .get(`${import.meta.env.VITE_API_URL}/api/checkout-session-details?session_id=${sessionId}`)
        .then((res) => {
          const data = res.data;
          setDetails({
            id: sessionId,
            amount: (data.amount_total / 100).toFixed(2),
            currency: data.currency.toUpperCase(),
            method: data.payment_method_types?.[0] || 'Stripe',
            orderId: data.metadata?.orderId || 'N/A',
            date: new Date(data.created * 1000).toLocaleString()
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
    if (paypalToken) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/capture-paypal-order?token=${paypalToken}`)
        .then((res) => {
          const data = res.data;
          setDetails({
            id: data.orderId,
            amount: data.amount.value,
            currency: data.amount.currency_code,
            method: 'PayPal',
            orderId: data.orderId,
            payer: `${data.payer.name.given_name} ${data.payer.name.surname}`,
            email: data.payer.email_address,
            date: new Date().toLocaleString()
          });
          setStatusMessage('✅ Payment successful via PayPal! 🎉');
        })
        .catch((err) => {
          console.error('PayPal capture failed:', err);
          setErrorMessage('PayPal payment verification failed.');
          setStatusMessage(null);
        });
      return;
    }

    // 3) Fallback for redirect-only PayPal confirmation (no token)
    if (paypalFlag === 'true' && orderId) {
      setDetails({ orderId });
      setStatusMessage('✅ Payment successful via PayPal! 🎉');
      return;
    }

    // 4) If no known params
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
            {details.payer && (
              <div className="detail-row">
                <span className="label">Payer:</span>
                <span className="value">{details.payer}</span>
              </div>
            )}
            {details.email && (
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{details.email}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="label">Amount Paid:</span>
              <span className="value">{details.currency} ${details.amount}</span>
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
