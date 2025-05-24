// src/pages/Checkout/PaymentPage.jsx
 import React, { useState, useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { useAuth } from '../../contexts/AuthContext.jsx';
 import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';
 import axios from 'axios';
 import visa from '../../assets/visa.png';
 import mastercard from '../../assets/mastercard.png';
 import americanexpress from '../../assets/American Express Card.png';
 import paypal from '../../assets/paypal.png';
 import stripe from '../../assets/stripe.png';
 import { fetchCartDetails, processPayment } from '../../services/api';
 import { FiExternalLink } from 'react-icons/fi';
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
  
  // ADD: Mapping objects from ShippingPage
  const bookSizeMap = {
    "pocketbook": "Pocket Book",
    "novella": "Novella",
    "digest": "Digest",
    "a5": "A5",
    "us_trade": "US Trade",
    "royal": "Royal",
    "executive": "Executive",
    "crown_quarto": "Crown Quarto",
    "small_square": "Small Square",
    "a4": "A4",
    "square": "Square",
    "us_letter": "US Letter",
    "small_landscape": "Small Landscape",
    "us_letter_landscape": "US Letter Landscape",
    "a4_landscape": "A4 Landscape",
    "comic": "Comic Book",
    "larger-deluxe": "Larger Deluxe",
    "manga": "Manga"
  };
  
  const bindingMap = {
    'perfect': 'Perfect Bound',
    'coil': 'Coil Bound',
    'saddle': 'Saddle Stitch',
    'case': 'Case Wrap',
    'linen': 'Linen Wrap',
    'wire-o': 'Wire-O',
    'leather': 'Leather Case Wrap',
    'faux-leather': 'Faux Leather Case Wrap',
    'polythin': 'Polythin Rexine Case Wrap'
  };
  
  const interiorColorMap = {
    'standard-bw': 'Standard Black & White',
    'premium-bw': 'Premium Black & White',
    'standard-color': 'Standard Color',
    'premium-color': 'Premium Color',
  };
  
  const paperTypeMap = {
    '60-cream': '60# Cream — Uncoated',
    '60-white': '60# White — Uncoated',
    '80-white': '80# White — Coated',
    '100-white': '100# White — Coated'
  };
  
  const coverFinishMap = {
    'glossy': 'Glossy',
    'matte': 'Matte',
  };

useEffect(() => {
  const loadOrderDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedCart = localStorage.getItem('currentCart');

      if (storedCart) {
        const cartData = JSON.parse(storedCart);
        setCart(cartData);
        console.log('Loaded persisted cart:', cartData);
      } else {
        setError('No cart data found. Please restart the checkout process.');
      }
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

  const formatOptionLabel = (optionId) => {
    if (!optionId) return 'N/A';
    return optionId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const renderCustomizations = () => {
    if (cart && cart.customizations) {
      const { activeOption, selectedBookSize, pageCount, bindingType, interiorColor, paperType, coverFinish, ...thesisOptions } = cart.customizations;
      const customizationText = [];

      if (bookSizeMap[selectedBookSize]) {
        customizationText.push(`Size: ${bookSizeMap[selectedBookSize]}`);
      }
      if (pageCount) {
        customizationText.push(`Pages: ${pageCount}`);
      }
      if (bindingMap[bindingType]) {
        customizationText.push(`Binding: ${bindingMap[bindingType]}`);
      }
      if (interiorColorMap[interiorColor]) {
        customizationText.push(`Interior: ${interiorColorMap[interiorColor]}`);
      }
      if (paperTypeMap[paperType]) {
        customizationText.push(`Paper: ${paperTypeMap[paperType]}`);
      }
      if (coverFinishMap[coverFinish]) {
        customizationText.push(`Cover: ${coverFinishMap[coverFinish]}`);
      }
      if (activeOption === 'thesis-binding') {
        if (bindingMap[thesisOptions.thesisBindingType]) customizationText.push(`Binding: ${bindingMap[thesisOptions.thesisBindingType]}`);
        if (thesisOptions.thesisSpine) customizationText.push(`Spine: ${formatOptionLabel(thesisOptions.thesisSpine)}`);
        if (thesisOptions.thesisExteriorColor) customizationText.push(`Exterior Color: ${formatOptionLabel(thesisOptions.thesisExteriorColor)}`);
        if (thesisOptions.thesisFoilStamping) customizationText.push(`Foil: ${formatOptionLabel(thesisOptions.thesisFoilStamping)}`);
        if (thesisOptions.thesisScreenStamping) customizationText.push(`Screen: ${formatOptionLabel(thesisOptions.thesisScreenStamping)}`);
        if (thesisOptions.thesisCornerProtector) customizationText.push(`Corner: ${formatOptionLabel(thesisOptions.thesisCornerProtector)}`);
        if (interiorColorMap[thesisOptions.thesisInteriorColor]) customizationText.push(`Interior: ${interiorColorMap[thesisOptions.thesisInteriorColor]}`);
        if (paperTypeMap[thesisOptions.thesisPaperType]) customizationText.push(`Paper: ${paperTypeMap[thesisOptions.thesisPaperType]}`);
      }

      return customizationText.join(', ');
    }
    return cart && cart.items && cart.items[0]?.configurationSummary;
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
                  <img src={stripe} alt="Stripe" style={{ height: '20px' }} />
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
                    {/* FIXED: Use renderCustomizations() to show dynamic options */}
                    <span className="item-configuration">{renderCustomizations()}</span>
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
    <span>${cart.subtotal?.toFixed(2)|| '0.00'} USD</span>
  </div>

  {cart.discountAmount > 0 && (
    <div className="total-row">
      <span>Discount Applied</span>
      <span>-${cart.discountAmount.toFixed(2)} USD</span>
    </div>
  )}

  <div className="total-row">
    <span>Shipping</span>
    <span>${cart.shippingCost?.toFixed(2)|| '0.00'} USD</span>
  </div>
  <div className="total-row">
    <span>Taxes</span>
    <span>${cart.taxes?.toFixed(2)|| '0.00'} USD</span>
  </div>
  <div className="total-row total-line">
    <span>Total</span>
    <span className="total-price-value">${cart.total?.toFixed(2)|| '0.00'} USD</span>
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