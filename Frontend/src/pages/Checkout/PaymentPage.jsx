// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';
import { loadStripe } from '@stripe/stripe-js';
import visa from '../../assets/visa.png';
import mastercard from '../../assets/mastercard.png';
import americanexpress from '../../assets/American Express Card.png';
import paypal from '../../assets/paypal.png';
import stripeLogo from '../../assets/stripe.png';
import './PaymentPage.css';
import cartitemimage from '../../assets/cart-item-image.png';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ← Fallback to http://localhost:5000 if VITE_API_URL isn’t defined
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('currentCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      setIsLoading(false);
    } else {
      setError('No cart data found. Please restart the checkout process.');
      setIsLoading(false);
    }
  }, []);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentError(null);
  };

  const handlePayment = async () => {
    if (!cart) {
      setPaymentError('Order data is missing.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    // Convert total to cents for Stripe/PayPal
    const amountInCents = Math.round(Number(cart.total) * 100);

    // Build payload for creating an Order (status="pending")
    const orderPayload = {
      items: cart.items.map(item => ({
        productId: item.id,
        name:       item.name,
        quantity:   Number(item.quantity),
        price:      Number(item.price)
      })),
      subtotal:       Number(cart.subtotal),
      discountAmount: Number(cart.discountAmount || 0),
      shippingCost:   Number(cart.shippingCost || 0),
      taxes:          Number(cart.taxes || 0),
      total:          Number(cart.total),
      paymentMethod:  selectedPaymentMethod === 'paypal'
                        ? 'paypal'
                        : selectedPaymentMethod === 'stripe_link'
                          ? 'stripe_link'
                          : 'stripe_card'
    };

    // Debug: log the payload to console so you can verify its shape/type
    console.log('⏺️ Sending create-order payload:', orderPayload);

    let mongoOrderId;
    try {
      // 1) Create the Order in MongoDB with paymentStatus="pending"
      const createOrderRes = await fetch(
        `${API_URL}/api/order/create-order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        }
      );
      const createOrderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        // If server sends back a validation error, throw it
        throw new Error(createOrderData.error || 'Failed to create order');
      }
      mongoOrderId = createOrderData.order._id;
    } catch (err) {
      console.error('Failed to create order before payment:', err);
      setPaymentError(err.message || 'Could not create order.');
      setIsProcessing(false);
      return;
    }

    try {
      if (selectedPaymentMethod === 'paypal') {
        // 2) Create PayPal order, passing our mongoOrderId
        const res = await fetch(
          `${API_URL}/api/create-paypal-order`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInCents, orderId: mongoOrderId })
          }
        );
        const data = await res.json();
        if (!res.ok || !data.approveUrl) {
          throw new Error(data.error || 'PayPal error');
        }
        window.location.href = data.approveUrl;
        return;
      }

      // 3) Create Stripe Checkout Session, passing our mongoOrderId in metadata
      const res = await fetch(
        `${API_URL}/api/create-checkout-session`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount:            amountInCents,
            orderId:           mongoOrderId,
            paymentMethodType: selectedPaymentMethod
          })
        }
      );
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Stripe error');
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id
      });
      if (error) setPaymentError(error.message);
    } catch (err) {
      console.error('Error in handlePayment:', err);
      setPaymentError(err.message || 'Payment failed. Try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="payment-page-container">Loading order details…</div>;

  if (error && !cart) {
    return (
      <div className="payment-page-container error-state">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry Loading Order</button>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <div className="top-area">
        <div className="checkout-header-area">
          <div className="checkout-header-top">
            <Link to="/shop" className="checkout-shop-link">Shop</Link>
            <Link to="/checkout/shipping" className="checkout-back-link">← Back To Shipping</Link>
          </div>
          <CheckoutStepIndicator currentStep={3} totalSteps={3} />
        </div>
      </div>

      <div className="checkout-content-area">
        <div className="checkout-content-inner">
          <div className="payment-form-area">
            <h2>Payment Information</h2>
            <p className="payment-info-subtitle">All Transactions Are Secure And Encrypted</p>

            <div className="payment-methods">
              {/* Credit Card */}
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={selectedPaymentMethod === 'credit_card'}
                  onChange={() => handlePaymentMethodChange('credit_card')}
                />
                Credit Card
                <div className="card-icons">
                  <img src={visa} alt="Visa" />
                  <img src={mastercard} alt="Mastercard" />
                  <img src={americanexpress} alt="American Express" />
                </div>
              </label>

              {/* Stripe Link */}
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe_link"
                  checked={selectedPaymentMethod === 'stripe_link'}
                  onChange={() => handlePaymentMethodChange('stripe_link')}
                />
                Pay Faster with Stripe Link
                <div className="stripe-logo">
                  <img src={stripeLogo} alt="Stripe Link" style={{ height: '20px' }} />
                </div>
              </label>

              {/* PayPal */}
              <label className="payment-method-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={selectedPaymentMethod === 'paypal'}
                  onChange={() => handlePaymentMethodChange('paypal')}
                />
                Pay with PayPal
                <div className="paypal-logo">
                  <img src={paypal} alt="PayPal" style={{ height: '20px' }} />
                </div>
              </label>
            </div>

            {paymentError && <div className="error-message">{paymentError}</div>}

            <div className="payment-buttons">
              <button onClick={handlePayment} disabled={isProcessing} className="btn btn-primary">
                {isProcessing
                  ? 'Processing…'
                  : selectedPaymentMethod === 'paypal'
                    ? 'Continue to PayPal'
                    : selectedPaymentMethod === 'stripe_link'
                      ? 'Pay with Stripe Link'
                      : 'Pay with Credit Card'}
              </button>
            </div>
          </div>

          <div className="cart-summary-area">
            <div className="cart-summary-header">
              <h2>Order Summary</h2>
            </div>
            <div className="cart-items-container">
              {cart.items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img src={cartitemimage} alt="cart item" className="cart-item-image" />
                    {item.quantity > 0 && <span className="quantity-badge">{item.quantity}</span>}
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name || 'Book'}</span>
                    <span className="item-configuration">{item.configurationSummary || ''}</span>
                  </div>
                  <div className="price-container">
                    <span className="item-price">${item.price?.toFixed(2) || '0.00'}</span>
                    <br />
                    <span className="price-per-book" style={{ fontSize: '0.8em', color: '#777' }}>
                      Price per book
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="discount-section">
              <span>Discount Applied: ${cart.discountAmount?.toFixed(2) || '0.00'}</span>
            </div>

            <div className="totals-section">
              <div className="total-row">
                <span>Subtotal</span>
                <span>${cart.subtotal?.toFixed(2) || '0.00'} USD</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="total-row">
                  <span>Discount</span>
                  <span>-${cart.discountAmount.toFixed(2)} USD</span>
                </div>
              )}
              <div className="total-row">
                <span>Shipping</span>
                <span>${cart.shippingCost?.toFixed(2) || '0.00'} USD</span>
              </div>
              <div className="total-row">
                <span>Taxes</span>
                <span>${cart.taxes?.toFixed(2) || '0.00'} USD</span>
              </div>
              <div className="total-row total-line">
                <span>Total</span>
                <span className="total-price-value">${cart.total?.toFixed(2) || '0.00'} USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
