import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';
import { loadStripe } from '@stripe/stripe-js';
import visa from '../../assets/visa.png';
import mastercard from '../../assets/mastercard.png';
import americanexpress from '../../assets/American Express Card.png';
import stripeLogo from '../../assets/stripe.png';
import './PaymentPage.css';
import cartitemimage from '../../assets/cart-item-image.png';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadOrderDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedCart = localStorage.getItem('currentCart');
        if (storedCart) {
          const cartData = JSON.parse(storedCart);
          setCart(cartData);
        } else {
          setError('No cart data found. Please restart the checkout process.');
        }
      } catch (err) {
        setError('Failed to load order details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadOrderDetails();
  }, []);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentError(null);
  };

  const handleStripePayment = async () => {
    if (!cart) {
      setPaymentError('Order data is missing.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: cart.orderId,
          amount: Math.round(cart.total * 100),
          paymentMethodType: selectedPaymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment session');
      }

      const session = await response.json();

      if (session.error) {
        setPaymentError(session.error);
        setIsProcessing(false);
        return;
      }

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        setPaymentError(error.message);
      }
    } catch (err) {
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="payment-page-container">Loading order details...</div>;
  }

  if (error && !cart) {
    return (
      <div className="payment-page-container error-state">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry Loading Order</button>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="payment-page-container empty-order">
        <h2>Order Not Found or Empty</h2>
        <p>There was an issue loading your order details. Please return to the cart.</p>
        <Link to="/cart">Go to Cart</Link>
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
                Pay with Credit Card
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
                Pay with Stripe Link (Saved Card)
                <div className="stripe-logo">
                  <img src={stripeLogo} alt="Stripe Link" style={{ height: '20px' }} />
                </div>
              </label>
            </div>

            {paymentError && (
              <div className="error-message" role="alert">
                {paymentError}
              </div>
            )}

            <div className="payment-buttons">
              <button
                onClick={handleStripePayment}
                disabled={isProcessing}
                className="btn btn-primary"
              >
                {isProcessing
                  ? 'Processing Payment...'
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
              {cart.items.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img src={cartitemimage} alt="cart item" className="cart-item-image" />
                    {item.quantity > 0 && (
                      <span className="quantity-badge">{item.quantity}</span>
                    )}
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name || 'Book'}</span>
                    <span className="item-configuration">{item.configurationSummary || ''}</span>
                  </div>
                  <div className="price-container">
                    <span className="item-price">${item.price?.toFixed(2) || '0.00'}</span>
                    <br />
                    <span className="price-per-book" style={{ fontSize: '0.8em', color: '#777' }}>Price per book</span>
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
