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
        const cartData = await fetchCartDetails(''); // Initial fetch without state

        // --- Retrieve customizations from Local Storage ---
        const storedCustomizations = localStorage.getItem('bookCustomizations');
        if (storedCustomizations) {
          const customizations = JSON.parse(storedCustomizations);
          console.log('Retrieved customizations on Shipping Page:', customizations);

          // Assuming cartData.items is an array with at least one item for the customized book
          if (cartData.items && cartData.items.length > 0) {
            const updatedItems = cartData.items.map(item => {
              // You might need a more specific way to identify the correct item if your cart can have multiple items
              if (item.name === customizations.productName) { // Example: matching by product name
                return { ...item, quantity: parseInt(customizations.quantity, 10) };
              }
              return item;
            });
            const updatedCart = { ...cartData, items: updatedItems, customizations };
            setCart(updatedCart);
            localStorage.setItem('currentCart', JSON.stringify(updatedCart));
            console.log('Saved cart to localStorage:', updatedCart);
          } else {
            const updatedCart = { ...cartData, customizations, items: [{
              name: customizations.productName,
              price: parseFloat(customizations.unitPrice), // Use the unit price from localStorage
              quantity: parseInt(customizations.quantity, 10),
              // Add other necessary properties for the cart item
            }] };
            setCart(updatedCart);
            localStorage.setItem('currentCart', JSON.stringify(updatedCart));
            console.log('Saved cart to localStorage:', updatedCart);
          }

          // Optionally, clear the stored data
          localStorage.removeItem('bookCustomizations');
        } else {
          setCart(cartData);
        }

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
 
  // Effect to recalculate tax on state change
useEffect(() => {
  if (cart) {
    const totalQty = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discountAmount = totalQty > 100 ? subtotal * 0.1 : 0;
    let taxes = state === 'Texas' ? (subtotal - discountAmount) * 0.0825 : 0;
    const shippingCost = cart.shippingCost;
    const total = subtotal - discountAmount + taxes + shippingCost;

    const updatedCart = {
      ...cart,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      taxes: parseFloat(taxes.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };

    setCart(updatedCart);
    localStorage.setItem('currentCart', JSON.stringify(updatedCart));
  }
}, [state, cart?.items, cart?.shippingCost]);
 
  // Handler for Form Submission
const handleSubmitShipping = async (event) => {
  event.preventDefault();
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

  try {
    const responseData = await submitShippingInfo(shippingData);
    console.log('Shipping info submission response:', responseData);

    // Save final cart state including tax/total
    localStorage.setItem('currentCart', JSON.stringify(cart));

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
 
  // Helper function to format option label
  const formatOptionLabel = (optionId) => {
    if (!optionId) return 'N/A';
    return optionId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
    return cart && cart.items && cart.items[0]?.configurationSummary; // Fallback to existing summary if no customizations
  };

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
<div className="cart-items-container">
  {cart.items.map((item, index) => {
    const handleQuantityChange = (e) => {
      const newQty = parseInt(e.target.value) || 1;
      const updatedItems = [...cart.items];
      updatedItems[index].quantity = newQty;

      const subtotal = updatedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      let discountAmount = 0;
      const totalQty = updatedItems.reduce((sum, i) => sum + i.quantity, 0);

      if (totalQty > 100) {
        discountAmount = subtotal * 0.10;
      }

      const taxes = state === 'Texas' ? (subtotal - discountAmount) * 0.0825 : 0;
      const shippingCost = cart.shippingCost;
      const total = subtotal - discountAmount + taxes + shippingCost;

      setCart({
        ...cart,
        items: updatedItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      });

      localStorage.setItem('currentCart', JSON.stringify({
        ...cart,
        items: updatedItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        taxes: parseFloat(taxes.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }));
    };

    return (
      <div key={item.id} className="cart-item">
        <div className="item-image-container">
          {item.imageUrl ? (
            <img src={cartitemimage} alt="cart item" className="cart-item-image" />
          ) : (
            <div className="item-image-placeholder"></div>
          )}
          {item.quantity > 0 && <span className="quantity-badge">{item.quantity}</span>}
        </div>
        <div className="item-details">
          <span className="item-name">{item.name || 'Book'}</span>
          <span className="item-configuration">{renderCustomizations()}</span>
        </div>
        {/* <div className="quantity-control">
          <label>
            Qty:
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              style={{ width: '60px', marginLeft: '8px' }}
            />
          </label
        </div> */}
         <div className="price-container">
        <span className="item-price">${item.price?.toFixed(2) || '0.00'}</span>
        <br />
        <span className="price-per-book" style={{ fontSize: '0.8em', color: '#777' }}>Price per book</span>
      </div>
      </div>
    );
  })}
</div>
 
 
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
 
 export default ShippingPage;

