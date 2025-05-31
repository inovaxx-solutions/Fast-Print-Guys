import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { fetchCartDetails } from '../../services/api';
import { submitShippingInfo } from '../../services/orderService';
import { getData } from 'country-list';
import { FiExternalLink } from 'react-icons/fi';
import cartitemimage from '../../assets/cart-item-image.png';
import './ShippingPage.css';
import CheckoutStepIndicator from '../../components/CheckoutStepIndicator.jsx';

// Mapping objects
const bookSizeMap = {
  "pocketbook": "Pocket Book (4.25 x 6.875 in / 108 x 175 mm)",
  "novella": "Novella (5 x 8 in / 127 x 203 mm)",
  "digest": "Digest (5.5 x 8.5 in / 140 x 216 mm)",
  "a5": "A5 (5.83 x 8.27 in / 148 x 210 mm)",
  "us_trade": "US Trade (6 x 9 in / 152 x 229 mm)",
  "royal": "Royal (6.14 x 9.21 in / 156 x 234 mm)",
  "executive": "Executive (7 x 10 in / 178 x 254 mm)",
  "crown_quarto": "Crown Quarto (7.44 x 9.68 in / 189 x 246 mm)",
  "small_square": "Small Square (7.5 x 7.5 in / 190 x 190 mm)",
  "a4": "A4 (8.27 x 11.69 in / 210 x 297 mm)",
  "square": "Square (8.5 x 8.5 in / 216 x 216 mm)",
  "us_letter": "US Letter (8.5 x 11 in / 216 x 279 mm)",
  "small_landscape": "Small Landscape (9 x 7 in / 229 x 178 mm)",
  "us_letter_landscape": "US Letter Landscape (11 x 8.5 in / 279 x 216 mm)",
  "a4_landscape": "A4 Landscape (11.69 x 8.27 in / 297 x 210 mm)",
  "comic": "Comic Book (6.625 x 10.25 in / 168 x 260 mm)",
  "larger-deluxe": "Larger Deluxe (7 x 10.875 in / 177.8 mm x 276.23 mm)",
  "manga": "Manga (Japanese Style Comics) (5 x 7.5 in / 127 mm x 190.5 mm)"
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

const formatOptionLabel = (optionId) => {
  if (!optionId) return 'N/A';
  return optionId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ShippingPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [boxLength, setBoxLength] = useState(0);
  const [boxWidth, setBoxWidth] = useState(0);
  const [boxHeight, setBoxHeight] = useState(0);
  const [isFetchingFedex, setIsFetchingFedex] = useState(false);
  const [fedexError, setFedexError] = useState(null);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCartDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Get stored book configuration
        const storedConfig = JSON.parse(localStorage.getItem('bookConfig') || '{}');
        const storedPrice = parseFloat(localStorage.getItem('bookPrice') || 0);
        const storedQuantity = parseInt(localStorage.getItem('bookQuantity') || 1);
        
        const cartData = {
          items: [{
            id: 'custom-book',
            name: `${formatOptionLabel(storedConfig.activeOption)}`,
            price: storedPrice,
            quantity: storedQuantity,
            configuration: storedConfig,
            imageUrl: cartitemimage
          }],
          subtotal: storedPrice * storedQuantity,
          shippingCost: 0,
          discountAmount: 0,
          taxes: 0,
          total: storedPrice * storedQuantity
        };
        
        setCart(cartData);
        localStorage.setItem('currentCart', JSON.stringify(cartData));
      } catch (err) {
        console.error('Failed to fetch cart details:', err);
        setError('Failed to load cart details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadCartDetails();
  }, []);

  useEffect(() => {
    const length = parseFloat(localStorage.getItem('boxLength')) || 0;
    const width = parseFloat(localStorage.getItem('boxWidth')) || 0;
    const height = parseFloat(localStorage.getItem('boxHeight')) || 0;
    
    setBoxLength(length);
    setBoxWidth(width);
    setBoxHeight(height);
  }, []);

  useEffect(() => {
    setCountries(getData());
  }, []);

  useEffect(() => {
    if (!cart) return;
    if (cart.subtotal <= 0) return;

    const totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
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

  const handleSubmitShipping = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !address || !country || !region || !city || !postalCode || !phone) {
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
      state: region,
      city,
      postalCode,
      phone,
      discountCode: discountCode || null,
    };

    try {
      await submitShippingInfo(shippingData);
      localStorage.setItem('currentCart', JSON.stringify(cart));
      navigate('/checkout/payment');
    } catch (err) {
      console.error('Shipping info submission failed:', err);
      setError(err.response?.data?.message || 'Failed to submit shipping information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFetchFedexRate = async () => {
    setFedexError(null);
    setIsFetchingFedex(true);
  
    try {
      const length = parseFloat(localStorage.getItem("boxLength")) || 0;
      const width = parseFloat(localStorage.getItem("boxWidth")) || 0;
      const height = parseFloat(localStorage.getItem("boxHeight")) || 0;
  
      if (!country || !region || !city || !postalCode) {
        throw new Error("Please fill in country, state, city, and postal code first.");
      }
  
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
  
      const allRates = resp.data.rates || [];
      const fedexRateObj = allRates.find((r) => {
        const desc = r.full_description || "";
        return /fedex/i.test(desc);
      });
  
      if (!fedexRateObj) {
        throw new Error("No FedEx service found in Easyship response.");
      }
  
      const amount = fedexRateObj.total_charge;
      if (amount == null) {
        throw new Error("Could not parse FedEx rate from Easyship response.");
      }
  
      const subtotal = cart.subtotal != null ? cart.subtotal : 0;
      const discountAmount = cart.discountAmount != null ? cart.discountAmount : 0;
      const taxes = region === "Texas"
        ? parseFloat(((subtotal - discountAmount) * 0.0825).toFixed(2))
        : 0;
  
      const shippingVal = parseFloat(amount.toFixed(2));
      const newTotal = parseFloat(
        (subtotal - discountAmount + shippingVal + taxes).toFixed(2)
      );
  
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

  const renderCustomizations = () => {
    if (cart && cart.items && cart.items[0]?.configuration) {
      const config = cart.items[0].configuration;
      const parts = [];
      
      if (config.selectedBookSize) 
        parts.push(`Size: ${bookSizeMap[config.selectedBookSize] || config.selectedBookSize}`);
      if (config.pageCount) 
        parts.push(`Pages: ${config.pageCount}`);
      if (config.bindingType) 
        parts.push(`Binding: ${bindingMap[config.bindingType] || config.bindingType}`);
      if (config.interiorColor) 
        parts.push(`Interior: ${interiorColorMap[config.interiorColor] || config.interiorColor}`);
      if (config.paperType) 
        parts.push(`Paper: ${paperTypeMap[config.paperType] || config.paperType}`);
      if (config.coverFinish) 
        parts.push(`Cover: ${coverFinishMap[config.coverFinish] || config.coverFinish}`);
      
      if (config.activeOption === 'thesis-binding') {
        if (config.thesisSpine) parts.push(`Spine: ${formatOptionLabel(config.thesisSpine)}`);
        if (config.thesisExteriorColor) parts.push(`Exterior: ${formatOptionLabel(config.thesisExteriorColor)}`);
        if (config.thesisFoilStamping) parts.push(`Foil: ${formatOptionLabel(config.thesisFoilStamping)}`);
        if (config.thesisScreenStamping) parts.push(`Screen: ${formatOptionLabel(config.thesisScreenStamping)}`);
        if (config.thesisCornerProtector) parts.push(`Corners: ${formatOptionLabel(config.thesisCornerProtector)}`);
      }
      
      return parts.join(', ');
    }
    return 'No customizations available';
  };

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
          <div className="shipping-address-form-area">
            <h2>Enter Your Shipping Address</h2>

            {error && !isLoading && (
              <div className="error-message" role="alert">{error}</div>
            )}

            <form className="shipping-form" onSubmit={handleSubmitShipping}>
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

              <div className="form-group">
                <label htmlFor="company">Company / Organization (Optional)</label>
                <input
                  type="text"
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

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
              <div className="form-group">
                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                  {isSubmitting ? 'Submitting…' : 'Choose Delivery Method'}
                </button>
              </div>
            </form>
          </div>

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
                    <img src={cartitemimage} alt="cart item" className="cart-item-image" />
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

            {cart && (
              <div className="totals-section">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${cart.subtotal?.toFixed(2) || '0.00'} USD</span>
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
              