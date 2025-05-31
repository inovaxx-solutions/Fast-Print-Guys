// src/pages/Checkout/ShippingPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';
import { fetchCartDetails } from '../../services/api';
import { submitShippingInfo } from '../../services/orderService';

import { getData } from 'country-list';

import { FiExternalLink } from 'react-icons/fi';
import cartitemimage from '../../assets/cart-item-image.png';

import './ShippingPage.css';

const ShippingPage = () => {
  // --------------------------------------------------------
  // 1) Rename “state” → “region” to avoid confusion with React’s state
  // --------------------------------------------------------
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');

 const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');   // was `state`
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [discountCode, setDiscountCode] = useState('');

  // Cart
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Box dimensions (from localStorage)
  const [boxLength, setBoxLength] = useState(0);
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);

  // FedEx Rate
  const [isFetchingFedex, setIsFetchingFedex] = useState(false);
  const [fedexError, setFedexError] = useState(null);

 // ─────────────────────────────────────────────────────────────
 // Countries dropdown
 // ─────────────────────────────────────────────────────────────
 const [countries, setCountries] = useState([]);

  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────────
  // 2) Fetch Cart Details on mount
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadCartDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const cartData = await fetchCartDetails('');
        const storedPriceRaw = localStorage.getItem('calculatedPrice');
        const storedPrice = storedPriceRaw ? parseFloat(storedPriceRaw) : NaN;

        // 1) We still pull cartData.items so we know what’s in the cart,
        //    but initially we override all numeric totals to zero:
        const initialCart = {
          ...cartData,
          shippingCost: 0.00,                    // still zero until “Calculate Total”
          discountAmount: 0.00,                  // no bulk discount yet
          taxes: 0.00,                           // no tax until state is chosen
          subtotal: !isNaN(storedPrice)          // if we have a storedPrice, use it; otherwise 0
            ? parseFloat(storedPrice.toFixed(2))
            : 0.00,
        };

        // Now build total = subtotal + shippingCost + taxes (discount=0)
        initialCart.total = parseFloat(
          (
            initialCart.subtotal
            - initialCart.discountAmount
            + initialCart.shippingCost
            + initialCart.taxes
          ).toFixed(2)
        );

        setCart(initialCart);
        // No need to write currentCart → localStorage just yet, since everything is zero.
        // But if you do want to keep a “currentCart” key, you can:
        localStorage.setItem('currentCart', JSON.stringify(initialCart));
      } catch (err) {
        console.error('Failed to fetch cart details:', err);
        setError('Failed to load cart details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCartDetails();
  }, []);

 // ─────────────────────────────────────────────────────────────
 // 3) Read box dimensions from localStorage on mount
 // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const length = parseFloat(localStorage.getItem('boxLength')) || 0;
    const width = parseFloat(localStorage.getItem('boxWidth')) || 0;
    const height = parseFloat(localStorage.getItem('boxHeight')) || 0;
    
    setBoxLength(length);
    setBoxWidth(width);
    setBoxHeight(height);
  }, []);

 // ─────────────────────────────────────────────────────────────
 // 4) Populate country dropdown on mount
 // ─────────────────────────────────────────────────────────────
 useEffect(() => {
   setCountries(getData());
 }, []);

  // ─────────────────────────────────────────────────────────────
  // 5) Recalculate tax/subtotal whenever “region” or cart.shippingCost changes
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cart) return;

    // If we haven’t set a real subtotal (from localStorage or items), bail out
    if (cart.subtotal <= 0) {
      return;
    }

    const totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    // Note: we want to preserve the “stored” subtotal, not re‐compute from item.price*quantity here.
    const subtotal = cart.subtotal;
    const discountAmount = totalQty > 100 ? subtotal * 0.1 : 0;
    const taxes = region === 'Texas' ? (subtotal - discountAmount) * 0.0825 : 0;
    const shippingCost = cart.shippingCost != null ? cart.shippingCost : 0;
    const total = subtotal - discountAmount + taxes + shippingCost;

    const updatedCart = {
      ...cart,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      taxes: parseFloat(taxes.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };

    setCart(updatedCart);
    localStorage.setItem('currentCart', JSON.stringify(updatedCart));
  }, [region, cart?.shippingCost]);

  // ─────────────────────────────────────────────────────────────
  // 6) Handle form submission (unchanged)
  // ─────────────────────────────────────────────────────────────
  const handleSubmitShipping = async (e) => {
    e.preventDefault();
    if (
      !firstName ||
      !lastName ||
      !address ||
      !country ||
      !region ||
      !city ||
      !postalCode ||
      !phone
    ) {
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
      state: region,      // send “region” as the shipping state
      city,
      postalCode,
      phone,
      discountCode: discountCode || null,
    };

    try {
      const responseData = await submitShippingInfo(shippingData);
      console.log('Shipping info submission response:', responseData);

      // Save final cart (with the updated shipping/taxes/total)
      localStorage.setItem('currentCart', JSON.stringify(cart));
      navigate('/checkout/payment');
    } catch (err) {
      console.error('Shipping info submission failed:', err);
      setError(err.response?.data?.message || 'Failed to submit shipping information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 7) Handle “Get FedEx Rate” button click
  //    Once we get “amount” from Easyship, overwrite cart.shippingCost
  // ─────────────────────────────────────────────────────────────
  const handleFetchFedexRate = async () => {
    setFedexError(null);
    setIsFetchingFedex(true);
  
    try {
      // 1) Re‐read dims from localStorage
      const length = parseFloat(localStorage.getItem("boxLength")) || 0;
      const width = parseFloat(localStorage.getItem("boxWidth")) || 0;
      const height = parseFloat(localStorage.getItem("boxHeight")) || 0;
  
      if (!country || !region || !city || !postalCode) {
        throw new Error("Please fill in country, state, city, and postal code first.");
      }
  
      // 2) Call your backend (no proxy assumed)
      const resp = await axios.get("http://localhost:5000/api/shipping/rates", {
        params: {
          length,
          width,
          height,
          country: country.trim(),
          state: region.trim(),
          city: city.trim(),
          postal_code: postalCode.trim(),
        },
      });
  
      console.log("▶ Easyship response (via React):", resp.data);
  
      // ────────────────────────────────────────────────────────────
      // 3) Grab the array of rate objects from resp.data.rates (not resp.data.data)
      // ────────────────────────────────────────────────────────────
      const allRates = resp.data.rates || [];
  
      // ────────────────────────────────────────────────────────────
      // 4) Find the first object whose `full_description` contains "FedEx"
      // ────────────────────────────────────────────────────────────
      const fedexRateObj = allRates.find((r) => {
        const desc = r.full_description || "";
        return /fedex/i.test(desc);
      });
  
      if (!fedexRateObj) {
        throw new Error("No FedEx service found in Easyship response.");
      }
  
      // 5) Extract the price from `total_charge` (per your console output)
      const amount = fedexRateObj.total_charge;
      if (amount == null) {
        throw new Error("Could not parse FedEx rate from Easyship response.");
      }
  
      // 6) Re‐calculate taxes if region === "Texas"
      const subtotal = cart.subtotal != null ? cart.subtotal : 0;
      const discountAmount = cart.discountAmount != null ? cart.discountAmount : 0;
      const taxes =
        region === "Texas"
          ? parseFloat(((subtotal - discountAmount) * 0.0825).toFixed(2))
          : 0;
  
      // 7) Compute new total = subtotal − discount + shipping + taxes
      const shippingVal = parseFloat(amount.toFixed(2));
      const newTotal = parseFloat(
        (subtotal - discountAmount + shippingVal + taxes).toFixed(2)
      );
  
      // 8) Overwrite cart.shippingCost, cart.taxes, cart.total
      const updatedCart = {
        ...cart,
        shippingCost: shippingVal,
        taxes,
        total: newTotal,
      };
  
      setCart(updatedCart);
      localStorage.setItem("currentCart", JSON.stringify(updatedCart));
    } catch (err) {
      console.error("Error fetching FedEx rate:", err);
      setFedexError(err.message || "Failed to fetch FedEx rate.");
    } finally {
      setIsFetchingFedex(false);
    }
  };
  
  

  // ─────────────────────────────────────────────────────────────
  // 8) Render helpers (unchanged)
  // ─────────────────────────────────────────────────────────────
  const renderCustomizations = () => {
    if (cart && cart.customizations) {
      const {
        activeOption,
        selectedBookSize,
        pageCount,
        bindingType,
        interiorColor,
        paperType,
        coverFinish,
        ...thesisOptions
      } = cart.customizations;
      const customizationText = [];

      if (selectedBookSize) customizationText.push(`Size: ${selectedBookSize}`);
      if (pageCount) customizationText.push(`Pages: ${pageCount}`);
      if (bindingType) customizationText.push(`Binding: ${bindingType}`);
      if (interiorColor) customizationText.push(`Interior: ${interiorColor}`);
      if (paperType) customizationText.push(`Paper: ${paperType}`);
      if (coverFinish) customizationText.push(`Cover: ${coverFinish}`);

      if (activeOption === 'thesis-binding') {
        if (thesisOptions.thesisBindingType)
          customizationText.push(`Binding: ${thesisOptions.thesisBindingType}`);
        if (thesisOptions.thesisSpine)
          customizationText.push(`Spine: ${thesisOptions.thesisSpine}`);
        if (thesisOptions.thesisExteriorColor)
          customizationText.push(`Exterior: ${thesisOptions.thesisExteriorColor}`);
        if (thesisOptions.thesisFoilStamping)
          customizationText.push(`Foil: ${thesisOptions.thesisFoilStamping}`);
        if (thesisOptions.thesisScreenStamping)
          customizationText.push(`Screen: ${thesisOptions.thesisScreenStamping}`);
        if (thesisOptions.thesisCornerProtector)
          customizationText.push(`Corner: ${thesisOptions.thesisCornerProtector}`);
        if (thesisOptions.thesisInteriorColor)
          customizationText.push(`Interior: ${thesisOptions.thesisInteriorColor}`);
        if (thesisOptions.thesisPaperType)
          customizationText.push(`Paper: ${thesisOptions.thesisPaperType}`);
      }
      return customizationText.join(', ');
    }
    return cart && cart.items && cart.items[0]?.configurationSummary;
  };

  // ─────────────────────────────────────────────────────────────
  // 9) Handle loading / error / empty states
  // ─────────────────────────────────────────────────────────────
  if (isLoading) {
    return <div className="shipping-page-container">Loading cart details…</div>;
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

  // ─────────────────────────────────────────────────────────────
  // 10) Final JSX render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="shipping-page-container">
      <div className="top-area">
        <div className="checkout-header-area">
          <div className="checkout-header-top">
            <Link to="/shop" className="checkout-shop-link">Shop</Link>
            <Link to="/pricing" className="checkout-back-link">← Back To Shopping</Link>
          </div>
          <CheckoutStepIndicator currentStep={2} totalSteps={3} />
        </div>
      </div>

      <div className="checkout-content-area">
        <div className="checkout-content-inner">
          {/* ────── Left Column: Shipping Address Form ────── */}
          <div className="shipping-address-form-area">
            <h2>Enter Your Shipping Address</h2>

            {error && !isLoading && (
              <div className="error-message" role="alert">{error}</div>
            )}

            <form className="shipping-form" onSubmit={handleSubmitShipping}>
              {/* Name Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Company / Organization */}
              <div className="form-group">
                <label htmlFor="company">Company / Organization (Optional)</label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Street Address"
                />
              </div>
              <div className="form-group">
                <label htmlFor="address2">Apt / Floor / Suite (Optional)</label>
                <input
                  type="text"
                  id="address2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  placeholder="Apartment, floor, unit, etc."
                />
              </div>

              {/* Country / State (Region) */}
              <div className="form-row">
                <div className="form-group">
                
                 <label htmlFor="country">Country</label>
                 <select
                   id="country"
                   value={country}
                   onChange={(e) => setCountry(e.target.value)}
                   required
                 >
                   <option value="" disabled>Select Country</option>
                   {countries.map(({ name, code }) => (
                     <option key={code} value={name}>
                       {name}
                     </option>
                   ))}
                 </select>
                </div>
                <div className="form-group">
                  <label htmlFor="region">State / Region</label>
                  <input
                    type="text"
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    required
                    placeholder="Select State"
                  />
                </div>
              </div>

              {/* City / Postal Code */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    placeholder="e.g., 10001"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="e.g., 123-456-7890"
                />
              </div>

              {/* Submit */}
              <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Submitting…' : 'Choose Delivery Method'}
                </button>
              </div>
            </form>
          </div>

          {/* ────── Right Column: Cart Summary ────── */}
          <div className="cart-summary-area">
            <div className="cart-summary-header">
              <h2>Cart summary</h2>
              <Link to="/cart" className="edit-cart-link">
                Edit <FiExternalLink className="edit-icon" />
              </Link>
            </div>

            <div className="cart-items-container">
              {cart.items.map((item, idx) => (
                <div key={item.id || idx} className="cart-item">
                  <div className="item-image-container">
                    {item.imageUrl ? (
                      <img src={cartitemimage} alt="cart item" className="cart-item-image" />
                    ) : (
                      <div className="item-image-placeholder" />
                    )}
                    {item.quantity > 0 && (
                      <span className="quantity-badge">{item.quantity}</span>
                    )}
                  </div>
                  <div className="item-details">
                    <span className="item-name">{item.name || 'Book'}</span>
                    <span className="item-configuration">{renderCustomizations()}</span>
                  </div>
                  <div className="price-container">
                    <span className="item-price">${(item.price || 0).toFixed(2)}</span>
                    <br />
                    <span className="price-per-book" style={{ fontSize: '0.8em', color: '#777' }}>
                      Price per book
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="discount-section">
              <input
                type="text"
                placeholder="Discount"
                className="discount-input"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button className="apply-button" onClick={() => {}}>
                Apply
              </button>
            </div>

            {/* Subtotal / Shipping / Taxes / Total */}
            {cart && (
              <div className="totals-section">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{cart.subtotal} USD</span>
                </div>

                {cart.discountAmount > 0 && (
                  <div className="total-row">
                    <span>Discount Applied</span>
                    <span>-${cart.discountAmount.toFixed(2)} USD</span>
                  </div>
                )}

                <div className="total-row">
                  <span>Shipping</span>
                  <span>${(cart.shippingCost || 0).toFixed(2)} USD</span>
                </div>
                <div className="total-row">
                  <span>Taxes</span>
                  <span>${(cart.taxes || 0).toFixed(2)} USD</span>
                </div>
                <div className="total-row total-line">
                  <span>Total</span>
                  <span className="total-price-value">
                    ${(cart.total || 0).toFixed(2)} USD
                  </span>
                </div>
              </div>
            )}

            {/* ─────────── “Calculate Total” Button ─────────── */}
            <div style={{ marginTop: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={handleFetchFedexRate}
                disabled={isFetchingFedex}
              >
                {isFetchingFedex ? 'Calculating Total…' : 'Calculate Total'}
              </button>

              {fedexError && (
                <p style={{ color: 'red', marginTop: '0.5rem' }}>{fedexError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
