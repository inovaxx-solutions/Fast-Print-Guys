// src/pages/Checkout/ShippingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';

import { fetchCartDetails } from '../../services/api';
import { submitShippingInfo } from '../../services/orderService';

import { FiExternalLink } from 'react-icons/fi';
import cartitemimage from '../../assets/cart-item-image.png';

import './ShippingPage.css';

const ShippingPage = () => {
  // State for Authentication (if required)
  // const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  // State for Shipping Address Form Inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  // State for Cart Details Display
  const [cart, setCart] = useState(null);

  // State for API Call Status
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Hook for Navigation
  const navigate = useNavigate();

  // Effect to Fetch Cart Details on Component Mount
  useEffect(() => {
    const loadCartDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cartData = await fetchCartDetails();
        setCart(cartData);
        console.log('Fetched cart details for Shipping Page:', cartData);
      } catch (err) {
        console.error('Failed to fetch cart details:', err);
        setError('Failed to load cart details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCartDetails();
  }, []);

  // Handler for Form Submission
  const handleSubmitShipping = async (event) => {
    event.preventDefault();

    // Basic Frontend Validation
    if (!firstName || !lastName || !address || !country || !state || !city || !postalCode || !phone) {
        setError('Please fill in all required fields.');
        return;
    }

    setIsSubmitting(true);
    setError(null);

    const shippingData = {
        firstName,
        lastName,
        company: company || null,
        address1: address,
        address2: address2 || null,
        country,
        state,
        city,
        postalCode,
        phone,
        discountCode: discountCode || null
    };

    console.log('Submitting shipping info:', shippingData);

    try {
        const responseData = await submitShippingInfo(shippingData);
        console.log('Shipping info submission response:', responseData);

        navigate('/checkout/payment');
    } catch (err) {
        console.error('Shipping info submission failed:', err);
        setError(err.response?.data?.message || 'Failed to submit shipping information. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  // Handler for Discount Apply button
  const handleApplyDiscount = () => {
    console.log('Applying discount code:', discountCode);
    // Call API to apply discount
  };


  // Render Loading/Error/Empty States
  if (isLoading) {
    return <div className="shipping-page-container">Loading cart details...</div>;
  }

  if (error && !cart) {
      return (
         <div className="shipping-page-container error-state">
             <p className="error-message">{error}</p>
             <button onClick={() => window.location.reload()}>Retry Loading Cart</button>
         </div>
      );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
      return (
          <div className="shipping-page-container empty-cart">
              <h2>Your Cart is Empty</h2>
              <p>Please add items to your cart before proceeding to checkout.</p>
              <Link to="/">Go to Homepage</Link>
          </div>
      );
  }

  // JSX Rendering for the Shipping Page
  return (
    <div className="shipping-page-container">

    <div className="top-area">
      {/* Checkout Header Area */}
      <div className="checkout-header-area">
          <div className="checkout-header-top">
              <Link to="/shop" className="checkout-shop-link">Shop</Link>
              <Link to="/pricing" className="checkout-back-link">← Back To Shopping</Link>
          </div>
          <CheckoutStepIndicator currentStep={2} totalSteps={3} />
      </div>
      </div>

      {/* Main Content Area (Two Columns) */}
      <div className="checkout-content-area"> {/* Full width background */}
          {/* Added Inner Container */}
          <div className="checkout-content-inner"> {/* Centers and limits content width */}
            {/* Left Column: Shipping Address Form with Blurred Background */}
            <div className="shipping-address-form-area">
              <h2>Enter Your Shipping Address</h2>

              {error && !isLoading && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <form className="shipping-form" onSubmit={handleSubmitShipping}>
                {/* Name Fields */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                   <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                </div>

                {/* Company Field */}
                 <div className="form-group">
                    <label htmlFor="company">Company / Organization (Optional)</label>
                    <input type="text" id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>

                {/* Address Fields */}
                 <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="Street Address" />
                </div>
                <div className="form-group">
                    <label htmlFor="address2">Apt / Floor / Suite (Optional)</label>
                    <input type="text" id="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Apartment, floor, unit, etc." />
                </div>

                {/* Country / State Row */}
                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input type="text" id="country" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="Select Country" />
                    </div>
                   <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} required placeholder="Select State" />
                    </div>
                </div>

                {/* City / Postal Code Row */}
                 <div className="form-row">
                   <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="City" />
                    </div>
                   <div className="form-group">
                        <label htmlFor="postalCode">Postal Code</label>
                        <input type="text" id="postalCode" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required placeholder="e.g., 10001" />
                    </div>
                </div>

                {/* Phone Number Field */}
                 <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="e.g., 123-456-7890" />
                </div>

                {/* Submission Button */}
                 <div className="form-group">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                       {isSubmitting ? 'Submitting...' : 'Choose Delivery Method'}
                    </button>
                </div>
            </form>
          </div>

        {/* Right Column: Cart Summary */}
        <div className="cart-summary-area">
            {/* Header */}
            <div className="cart-summary-header"> {/* New div for header */}
                <h2>Cart summary</h2>
                <Link to="/cart" className="edit-cart-link">
                    Edit <FiExternalLink className="edit-icon" /> {/* Changed icon */}
                </Link>
            </div>

            {/* Cart Items Container - ADDED */}
            <div className="cart-items-container"> {/* This will have the pale blue background */}
                {/* Display Cart Items */}
                {cart && cart.items && cart.items.map(item => (
                    <div key={item.id} className="cart-item">
                        {/* Image and Quantity Badge */}
                        <div className="item-image-container"> {/* New container for image and badge */}
                            <img src={cartitemimage} alt="cart item" className="cart-item-image"/>
                            {/* Quantity Badge */}
                            {item.quantity > 0 && ( // Show badge for quantity > 0
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
            </div> {/* END Cart Items Container */}


            {/* Discount Section */}
            <div className="discount-section">
                <input
                    type="text"
                    placeholder="Discount"
                    className="discount-input"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                />
                <button className="apply-button" onClick={handleApplyDiscount}>Apply</button>
            </div>

            {/* Subtotal, Taxes, Total */}
            {cart && (
            <div className="totals-section">
                <div className="total-row">
                    <span>Subtotal</span>
                    <span>${cart.subtotal?.toFixed(2) || '0.00'} USD</span>
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
            )}
        </div> {/* End Right Column */}
        </div> {/* End Inner Container */}
      </div> {/* End Main Content Area */}
    </div>
  );
};

export default ShippingPage;