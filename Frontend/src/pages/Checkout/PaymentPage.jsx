// src/pages/Checkout/PaymentPage.jsx
 import React, { useState, useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuth } from '../../contexts/AuthContext.jsx'; // If payment requires authentication
 import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';
 import axios from 'axios'; // Import Axios
 import visa from '../../assets/visa.png';
 import mastercard from '../../assets/mastercard.png';
 import americanexpress from '../../assets/American Express Card.png';
 import paypal from '../../assets/paypal.png';
 import stripe from '../../assets/stripe.png';
 // Import API service functions (will be simulated with dummy data via Axios calls)
 import { fetchCartDetails, processPayment } from '../../services/api';
 
 // Import icons if needed (e.g., for card types - not implemented in this basic skeleton)
 // import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
 import { FiExternalLink } from 'react-icons/fi'; // Keep for Cart Summary Edit link
 
 // Import CSS (will be created based on this JSX structure)
 import './PaymentPage.css';
 import cartitemimage from '../../assets/cart-item-image.png';
 
 const PaymentPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
 
  useEffect(() => {
  const loadOrderDetails = async () => {
  setIsLoading(true);
  setError(null);
  try {
  const cartData = await fetchCartDetails();
  setCart(cartData);
  console.log('Fetched cart details for Payment Page:', cartData);
  } catch (err) {
  console.error('Failed to load order details for payment:', err);
  setError('Failed to load order details. Please try again.');
  } finally {
  setIsLoading(false);
  }
  };
  loadOrderDetails();
  }, []);
 
  const handlePaymentMethodChange = (method) => {
  setSelectedPaymentMethod(method);
  setCardNumber('');
  setExpiryDate('');
  setCvv('');
  setCardName('');
  setPaymentError(null);
  };
 
  const handlePaymentSubmit = async (event) => {
  event.preventDefault();
  setPaymentError(null);
 
  if (selectedPaymentMethod === 'credit_card') {
  if (!cardNumber || !expiryDate || !cvv || !cardName) {
  setPaymentError('Please fill in all required credit card details.');
  return;
  }
  } else if (selectedPaymentMethod === 'paypal') {
  // Add PayPal specific validation if needed
  } else if (selectedPaymentMethod === 'stripe') {
  // Add Stripe specific validation if needed
  } else {
  setPaymentError('Please select a payment method.');
  return;
  }
 
  setIsProcessingPayment(true);
 
  const paymentData = {
  paymentMethod: selectedPaymentMethod,
  orderId: cart?.orderId,
  ...(selectedPaymentMethod === 'credit_card' && { cardNumber, expiryDate, cvv, cardName }),
  // Add PayPal and Stripe specific data if needed
  };
 
  console.log('Submitting payment information:', paymentData);
 
  try {
  const paymentResponse = await processPayment(paymentData);
  console.log('Payment processing response:', paymentResponse);
  if (paymentResponse?.success) {
  console.log('Payment successful, navigating to order confirmation...');
  navigate('/checkout/confirmation');
  } else {
  setPaymentError(paymentResponse?.message || 'Payment failed.');
  }
  } catch (err) {
  console.error('Payment processing failed:', err);
  setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.');
  } finally {
  setIsProcessingPayment(false);
  }
  };
 
  const handleCancelPayment = () => {
  console.log('Payment cancelled, navigating back...');
  navigate('/cart');
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
  <label className="payment-method-option">
  <input type="radio" name="paymentMethod" value="credit_card" checked={selectedPaymentMethod === 'credit_card'} onChange={() => handlePaymentMethodChange('credit_card')} />
  Credit Card
  <div className="card-icons">
  <img src={visa} alt="Visa" />
  <img src={mastercard} alt="Mastercard" />
  <img src={americanexpress} alt="American Express" />
  </div>
  </label>
  <label className="payment-method-option">
  <input type="radio" name="paymentMethod" value="paypal" checked={selectedPaymentMethod === 'paypal'} onChange={() => handlePaymentMethodChange('paypal')} />
  Paypal
  <div className="paypal-logo">
  <img src={paypal} alt="PayPal" />
  </div>
  </label>
  {/* Add Stripe option here */}
  <label className="payment-method-option">
  <input
  type="radio"
  name="paymentMethod"
  value="stripe"
  checked={selectedPaymentMethod === 'stripe'}
  onChange={() => handlePaymentMethodChange('stripe')}
  />
  Stripe
  <div className="stripe-logo">
  <img src={stripe} alt="Stripe" />
  </div>
  </label>
  </div>
 
  <form className="payment-form" onSubmit={handlePaymentSubmit}>
  {paymentError && (
  <div className="error-message" role="alert">
  {paymentError}
  </div>
  )}
 
  {selectedPaymentMethod === 'credit_card' && (
  <div className="credit-card-fields">
  <div className="form-group">
  <label htmlFor="cardNumber">Card Number</label>
  <input type="text" id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required placeholder="0000 0000 0000 0000" />
  </div>
  <div className="form-row">
  <div className="form-group">
  <label htmlFor="expiryDate">Expiry Date</label>
  <input type="text" id="expiryDate" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required placeholder="MM/YY" />
  </div>
  <div className="form-group">
  <label htmlFor="cvv">CVV</label>
  <input type="text" id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} required placeholder="XXX" />
  </div>
  </div>
  <div className="form-group">
  <label htmlFor="cardName">Name on Card</label>
  <input type="text" id="cardName" value={cardName} onChange={(e) => setCardName(e.target.value)} required placeholder="Full Name" />
  </div>
  </div>
  )}
 
  {selectedPaymentMethod === 'paypal' && (
  <div className="paypal-info">
  <p>You will be redirected to PayPal to complete your purchase.</p>
  </div>
  )}
 
  {selectedPaymentMethod === 'stripe' && (
  <div className="stripe-info">
  <p>Stripe payment option will appear here once fully integrated.</p>
  </div>
  )}
 
  <div className="payment-buttons">
  <button type="button" className="btn btn-secondary" onClick={handleCancelPayment}>
  Cancel
  </button>
  <button type="submit" disabled={isProcessingPayment || !selectedPaymentMethod || (selectedPaymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv || !cardName))} className="btn btn-primary">
  {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
  </button>
  </div>
  </form>
  </div>

  <div className="cart-summary-area">
  <div className="cart-summary-header">
  <h2>Order Summary</h2>
  </div>
  <div className="cart-items-container">
  {cart && cart.items && cart.items.map(item => (
  <div key={item.id} className="cart-item">
  <div className="item-image-container">
  {item.imageUrl ? (
  <img src={cartitemimage} alt="cart item" className="cart-item-image" />
  ) : (
  <div className="item-image-placeholder"></div>
  )}
  {item.quantity > 0 && (
  <span className="quantity-badge">{item.quantity}</span>
  )}
  </div>
  <div className="item-details">
  <span className="item-name">{item.name || 'Book'}</span>
  <span className="item-configuration">{item.configurationSummary || 'Paperback'}</span>
  </div>
  <span className="item-price">${item.price?.toFixed(2) || '0.00'}</span>
  </div>
  ))}
  </div>
  <div className="discount-section">
  <span>Discount Applied: ${cart?.discountAmount?.toFixed(2) || '0.00'}</span>
  </div>
  {cart && (
  <div className="totals-section">
  <div className="total-row">
  <span>Subtotal</span>
  <span>${cart.subtotal?.toFixed(2) || '0.00'} USD</span>
  </div>
  <div className="total-row">
  <span>Shipping</span>
  <span>${cart.shippingCost?.toFixed(2) || '0.00'} USD</span>
  </div>
  <div className="total-row">
  <span>Taxes</span>
  <span>${cart.taxes?.toFixed(2) || '0.00'} USD</span>
  </div>
  <div className="total-row total-line">
  <span>Order Total</span>
  <span className="total-price-value">${cart.total?.toFixed(2) || '0.00'} USD</span>
  </div>
  </div>
  )}
  </div>
  </div>
  </div>
  </div>
  );
 };
 export default PaymentPage;