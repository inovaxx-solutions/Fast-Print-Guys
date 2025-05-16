// src/pages/Pricing/components/BodyContent/BodyContent.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BodyContent.css';
// Import the API service function
import { calculateBookPrice } from '../../../../services/pricing';
import { addToCart } from '../../../../services/api';

import perfectBoundImg from '../../../../assets/perfectbound.png';
import coilBoundImg from '../../../../assets/coilbound.png';
import saddleStitchImg from '../../../../assets/saddlestich.png';
import caseWrapImg from '../../../../assets/casewrap.png';
import linenWrapImg from '../../../../assets/linenwrap.png';
import standardBwImg from '../../../../assets/standardbw.png';
import premiumBwImg from '../../../../assets/premiumbw.png';
import standardColorImg from '../../../../assets/standardcolor.png';
import premiumColorImg from '../../../../assets/premiumcolor.png';
import glossyImg from '../../../../assets/glossy.png';
import matteImg from '../../../../assets/matte.png';
import sixtyCreamImg from '../../../../assets/60cream.png';
import sixtyWhiteImg from '../../../../assets/60white.png';
import eightyWhiteImg from '../../../../assets/80white.png';
import bookPreviewImg from '../../../../assets/leftcol_img.png';



// --- Data Mappings (remain the same) ---
const bookSizeMap = {
  'pocket': 'Pocket Book (4 x 6 in)',
  'standard': 'Standard (6 x 9 in)',
  'large': 'Large (8.5 x 11 in)',
};

const bindingMap = {
  'perfect': 'Paperback Perfect Bound',
  'coil': 'Paperback Coil Bound',
  'saddle': 'Paperback Saddle Stitch',
  'case': 'Hardcover Case Wrap',
  'linen': 'Hardcover Linen Wrap (with Dust Jacket)',
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
};

const coverFinishMap = {
  'glossy': 'Glossy',
  'matte': 'Matte',
};


// --- Helper Components (remain the same) ---
// Reusable Radio Option Component
const RadioOption = ({ id, name, value, checked, onChange, imageSrc, labelText }) => (
  <div className="option-item">
    <label htmlFor={id} className="option-label">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <div className="option-image" style={{ backgroundImage: `url(${imageSrc})` }}></div>
      <span className="option-text">{labelText}</span>
    </label>
  </div>
);

// Reusable Select Input Component
const SelectInput = ({ id, value, onChange, options, placeholder, label }) => (
  <div className="select-wrapper">
      {label && <label htmlFor={id} className="select-label">{label}</label>}
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="select-input"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
      <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
      </svg>
  </div>
);


// --- Helper function to format option ID into a displayable string ---
const formatOptionLabel = (optionId) => {
  if (!optionId) return 'Loading...'; // Or a suitable default
  // Split by hyphen, capitalize first letter of each word, join with space
  return optionId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};


// --- Helper function for dummy calculation (extracted) ---
const calculateDummyPrice = (config) => {
    let basePrice = 5.00;
    if (config.bookSize === 'standard') basePrice += 1.00;
    if (config.bookSize === 'large') basePrice += 2.50;

    basePrice += (config.pageCount / 100) * 1.50;

    if (config.bindingType && config.bindingType.startsWith('hardcover')) basePrice += 4.00;
    if (config.bindingType === 'coil') basePrice += 0.50;
    if (config.bindingType === 'saddle') basePrice += 0.25;
    if (config.bindingType === 'linen') basePrice += 1.00;

    if (config.interiorColor.includes('premium')) basePrice += 1.50;
    if (config.interiorColor.includes('color')) basePrice += (config.pageCount / 100) * 2.00;

    if (config.paperType === '80-white') basePrice += 1.00;

    if (config.coverFinish === 'glossy') basePrice += 0.20;

    return basePrice.toFixed(2);
};


// --- Main Content Component ---
// Accepts activeOption prop from parent (PricingPage.jsx)
const BodyContent = ({ activeOption = 'print-book' }) => { // Default to print-book
// --- Hooks ---
  const navigate = useNavigate();  
    // --- State ---
  // Note: These state variables and handlers are currently designed for Print Book
  // If different book types have significantly different config options,
  // you might need to adjust how state is managed or passed down.
  const [selectedBookSize, setSelectedBookSize] = useState('pocket'); // Default to pocket
  const [pageCount, setPageCount] = useState('100'); // Default to 100
  const [bindingType, setBindingType] = useState('case'); // Combined binding state, default 'case'
  const [interiorColor, setInteriorColor] = useState('standard-bw'); // Default standard B&W
  const [paperType, setPaperType] = useState('60-white'); // Default 60# White
  const [coverFinish, setCoverFinish] = useState('matte'); // Default Matte

  // State for calculated price (shared across all calculation types)
  const [calculatedPrice, setCalculatedPrice] = useState(calculateDummyPrice({ // Use dummy calc for initial state
        bookSize: 'pocket', pageCount: 100, bindingType: 'case',
        interiorColor: 'standard-bw', paperType: '60-white', coverFinish: 'matte'
    }));

  // State for API loading and error for price calculation (shared)
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);


  // State for collapsible sections (remain the same)
  const [showShippingEstimates, setShowShippingEstimates] = useState(false); // Closed by default
  const [showRevenueEstimates, setShowRevenueEstimates] = useState(false); // Closed by default

  // State for Quantity & Shipping inputs and results (remain the same)
  const [quantity, setQuantity] = useState(1); // Default quantity
  const [selectedCountry, setSelectedCountry] = useState(''); // Default empty country
  const [shippingEstimate, setShippingEstimate] = useState(null); // Result state

  // State for Revenue Estimates inputs and results (remain the same)
  const [estimatedSales, setEstimatedSales] = useState(100); // Default estimated sales
  const [estimatedRevenue, setEstimatedRevenue] = useState(null); // Result state

  // Add state specifically for the button's loading/error if you want separate feedback
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);


  // --- Effects ---
  // Effect for main price calculation (Triggered when Print Book options change OR when activeOption becomes 'print-book')
  // Note: This effect currently assumes the backend API uses the SAME input structure
  // (bookSize, pageCount, bindingType, etc.) for ALL product types, and only
  // needs the `productType` field to differentiate. If your backend is different,
  // this logic will need to be updated.
  useEffect(() => {
    // Construct the configuration object to send to the API
    // Include the activeOption as the 'productType' or similar
    const bookConfig = {
        productType: activeOption, // Include the selected product type
        bookSize: parseInt(selectedBookSize === 'pocket' ? 4 : selectedBookSize === 'standard' ? 6 : 8.5), // Example: send dimensions as numbers
        bookSizeUnit: selectedBookSize === 'large' ? 'in' : 'x 9 in', // Simplify unit for standard/pocket? Or send both values?
        pageCount: parseInt(pageCount || 0),
        bindingType: bindingType,
        interiorColor: interiorColor,
        paperType: paperType,
        coverFinish: coverFinish,
        // Add other relevant selections here if your API needs them
    };

    // --- Asynchronous function to fetch price or use dummy calculation ---
    const fetchCalculatedPrice = async () => {
      setPriceError(null); // Clear previous errors
      setIsPriceLoading(true); // Set loading state

      try {
        // --- Call the API Service Function ---
        const result = await calculateBookPrice(bookConfig);

        // Assuming your API still returns { price: number } for all product types
        if (result && typeof result.price === 'number') {
          setCalculatedPrice(result.price.toFixed(2));
          console.log('API price received for', activeOption, ':', result.price.toFixed(2));
        } else {
          console.error('API returned unexpected data format:', result);
          setPriceError('Could not get price. Invalid API response.');
          console.log('Falling back to dummy calculation due to bad API response for', activeOption);
          // Note: The dummy calculation is still based on the Print Book logic
          const dummyPrice = calculateDummyPrice(bookConfig);
          setCalculatedPrice(dummyPrice);
        }

      } catch (err) {
        console.error('Error fetching price for', activeOption, ':', err);
        setPriceError(err.message || 'Failed to calculate price. Please try again.');

        // --- Fallback to Dummy Calculation on API Error ---
        console.log('Falling back to dummy calculation due to API error for', activeOption);
        // Note: The dummy calculation is still based on the Print Book logic
        const dummyPrice = calculateDummyPrice(bookConfig);
        setCalculatedPrice(dummyPrice);

      } finally {
        setIsPriceLoading(false); // Always set loading to false
      }
    };

    // --- Trigger the price calculation ---
    // This now runs whenever any Print Book option changes OR the activeOption changes
    fetchCalculatedPrice();

  }, [selectedBookSize, pageCount, bindingType, interiorColor, paperType, coverFinish, activeOption]); // Dependencies now include activeOption


  // Effect for Quantity & Shipping Estimates (simulated API call - kept for now)
  // TODO: Convert this to use your pricing.js service function (e.g., getShippingEstimate) later
  // You might want to add activeOption to this dependency array too, depending on how shipping/revenue
  // are calculated for other book types.
  useEffect(() => {
    if (showShippingEstimates && quantity > 0 && selectedCountry) {
      console.log('Simulating API call for shipping estimate...', { quantity, selectedCountry, activeOption }); // Added activeOption to log
      // Simulate network delay and API response
      const dummyShippingData = {
        'us': quantity * 0.5 + 5, // Example: $0.50 per book + $5 base
        'ca': quantity * 0.7 + 8, // Example: $0.70 per book + $8 base
        // Add more dummy country data as needed
      };

      const timer = setTimeout(() => {
        const estimate = dummyShippingData[selectedCountry] || (quantity * 1 + 10); // Fallback dummy
        setShippingEstimate(estimate.toFixed(2));
        console.log('Dummy shipping estimate received:', estimate.toFixed(2));
      }, 500); // Simulate 500ms network delay

      return () => clearTimeout(timer); // Cleanup the timer on unmount or dependency change
    } else {
      setShippingEstimate(null); // Clear estimate if conditions aren't met
    }
  }, [showShippingEstimates, quantity, selectedCountry, activeOption]); // Added activeOption to dependencies


  // Effect for Revenue Estimates (simulated API call - kept for now)
  // TODO: Convert this to use your pricing.js service function (e.g., getRevenueEstimate) later
  // You might want to add activeOption to this dependency array too.
  useEffect(() => {
    if (showRevenueEstimates && estimatedSales > 0 && calculatedPrice !== null) {
      console.log('Simulating API call for revenue estimate...', { estimatedSales, calculatedPrice, activeOption }); // Added activeOption to log
      // Simulate network delay and API response
      // Dummy calculation: (Book Price - Estimated Print Cost) * Royalty Rate * Estimated Sales
      // For simplicity, let's assume a print cost and royalty rate
      const dummyPrintCost = parseFloat(calculatedPrice) * 0.5; // Dummy: 50% of book price
      const dummyRoyaltyRate = 0.6; // Dummy: 60% royalty

      const timer = setTimeout(() => {
        const revenue = (parseFloat(calculatedPrice) - dummyPrintCost) * dummyRoyaltyRate * estimatedSales;
        setEstimatedRevenue(revenue.toFixed(2));
        console.log('Dummy revenue estimate received:', revenue.toFixed(2));
      }, 500); // Simulate 500ms network delay

      return () => clearTimeout(timer); // Cleanup the timer

    } else {
      setEstimatedRevenue(null); // Clear estimate if conditions aren't met
    }
  }, [showRevenueEstimates, estimatedSales, calculatedPrice, activeOption]); // Added activeOption to dependencies


  // --- Handlers (remain the same) ---
  // Note: These handlers update state variables that are currently used
  // across all product types with this simplified approach.
  const handleBookSizeChange = (e) => setSelectedBookSize(e.target.value);
  const handlePageCountChange = (e) => setPageCount(e.target.value);
  const handleBindingChange = (value) => setBindingType(value);
  const handleInteriorColorChange = (value) => setInteriorColor(value);
  const handlePaperTypeChange = (value) => setPaperType(value);
  const handleCoverFinishChange = (value) => setCoverFinish(value);

  const toggleShippingEstimates = () => setShowShippingEstimates(!showShippingEstimates);
  const toggleRevenueEstimates = () => setShowRevenueEstimates(!showRevenueEstimates);

  const handleQuantityChange = (e) => setQuantity(parseInt(e.target.value || 0));
  const handleCountryChange = (e) => setSelectedCountry(e.target.value);
  const handleEstimatedSalesChange = (e) => setEstimatedSales(parseInt(e.target.value || 0));

  // --- NEW Handler for the "Create Your _____" Button ---
    const handleCreateYourBook = async () => {
        // Clear previous errors
        setAddToCartError(null);
        setIsAddingToCart(true); // Set loading state for the button
    
        // 1. Gather the current configuration state
        // This object structure should match what your addToCart API expects
        const itemDetails = {
            productType: activeOption, // e.g., 'print-book', 'ebook'
            // Include all relevant configuration options from state
            configuration: {
                bookSize: selectedBookSize,
                pageCount: parseInt(pageCount || 0),
                bindingType: bindingType, // Only relevant for print types
                interiorColor: interiorColor,
                paperType: paperType,
                coverFinish: coverFinish, // Only relevant for print types
                // Add other selected options specific to the activeOption if needed
                // e.g., ebookFormat: selectedEbookFormat, photoAlbumLayout: selectedLayout, etc.
            },
            quantity: quantity > 0 ? quantity : 1, // Use the quantity input, default to 1 if invalid/0
            // You might also include the calculatedPrice here if your backend expects it
            // calculatedPrice: parseFloat(calculatedPrice), // Ensure calculatedPrice is a number
        };
    
        console.log('Creating item with details:', itemDetails);
    
        try {
            // 2. Call the API service function to add the item to the cart
            // The response data might contain the updated cart, a success message, etc.
            const cartResponse = await addToCart(itemDetails);
            console.log('Item added to cart successfully:', cartResponse);
    
            // 3. Navigate to the first checkout page on success
            console.log('Navigating to checkout...');
            navigate('/checkout/shipping'); // <-- The route you set up for the first checkout page
    
        } catch (error) {
            console.error('Failed to add item to cart and proceed to checkout:', error);
            // Display an error message to the user near the button or form
            setAddToCartError(error.response?.data?.message || 'Could not add item to cart. Please try again.');
        } finally {
            setIsAddingToCart(false); // Turn off loading state
        }
      };
    


  // --- Options Data (remain the same) ---
  // Note: These options data structures are currently used
  // across all product types with this simplified approach.
  const bookSizeOptions = [
    { value: 'pocket', label: 'Pocket Book (4 x 6 in)' },
    { value: 'standard', label: 'Standard (6 x 9 in)' },
    { value: 'large', label: 'Large (8.5 x 11 in)' },
  ];

  const pageCountOptions = [
    { value: '24', label: '24 Pages' },
    { value: '50', label: '50 Pages' },
    { value: '100', label: '100 Pages' },
    { value: '150', label: '150 Pages' },
    { value: '200', label: '200 Pages' },
    { value: '300', label: '300 Pages' },
  ];

  const paperbackOptions = [
    { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
    { id: 'binding-coil', value: 'coil', imageSrc: coilBoundImg, labelText: 'Coil Bound' },
    { id: 'binding-saddle', value: 'saddle', imageSrc: saddleStitchImg, labelText: 'Saddle Stitch' },
  ];

  const hardcoverOptions = [
    { id: 'binding-case', value: 'case', imageSrc: caseWrapImg, labelText: 'Case Wrap' },
    { id: 'binding-linen', value: 'linen', imageSrc: linenWrapImg, labelText: 'Linen Wrap (with Dust Jacket)' },
  ];

  const colorOptions = [
    { id: 'color-standard-bw', value: 'standard-bw', imageSrc: standardBwImg, labelText: 'Standard Black & White' },
    { id: 'color-premium-bw', value: 'premium-bw', imageSrc: premiumBwImg, labelText: 'Premium Black & White' },
    { id: 'color-standard-color', value: 'standard-color', imageSrc: standardColorImg, labelText: 'Standard Color' },
    { id: 'color-premium-color', value: 'premium-color', imageSrc: premiumColorImg, labelText: 'Premium Color' },
  ];

  const paperOptions = [
    { id: 'paper-60-cream', value: '60-cream', imageSrc: sixtyCreamImg, labelText: '60# Cream — Uncoated' },
    { id: 'paper-60-white', value: '60-white', imageSrc: sixtyWhiteImg, labelText: '60# White — Uncoated' },
    { id: 'paper-80-white', value: '80-white', imageSrc: eightyWhiteImg, labelText: '80# White — Coated' },
  ];

  const finishOptions = [
    { id: 'finish-glossy', value: 'glossy', imageSrc: glossyImg, labelText: 'Glossy' },
    { id: 'finish-matte', value: 'matte', imageSrc: matteImg, labelText: 'Matte' },
  ];

  const countryOptions = [
    { value: '', label: 'Select Country' }, // Placeholder
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'gb', label: 'United Kingdom' },
    // Add more countries as needed
  ];


  // --- Render Logic (Corrected for Layout) ---
  const renderContent = () => {
    // We'll still use a switch, but each case returns a structure that
    // uses the *original* CSS class names to maintain styling.
    // The content *within* that structure uses the dynamic labels.
    switch (activeOption) {
      case 'print-book':
      case 'art-book':
      case 'comic-book':
       case 'magazine':
      case 'yearbook':
      case 'calendar':
      case 'photo-book':
      case 'ebook':
      case 'journal':
        // All these cases render the same structure, but with dynamic text
        return (
          <div className="print-book-content fade-in">
            {/* Use the original container class for layout */}
            <div className="print-book-container">
              {/* --- Left Column --- */}
              <div className="left-column">
                {/* Use the original config panel class */}
                <div className="print-book-config">
                  {/* Use the helper function for the main title */}
                  <h2 className="section-title">{formatOptionLabel(activeOption)}</h2>

                  {/* Configuration sections (Book Size, Binding, Interior Color, Paper Type, Cover Finish) */}
                  {/* These sections and their inputs/options remain the same structure */}

                  {/* Book Size & Page Count */}
                  <div className="config-section config-section-gradient">
                    <h3 className="config-title config-title-light">Book Size & Page Count</h3>
                    <div className="input-group">
                      <SelectInput id="book-size" value={selectedBookSize} onChange={handleBookSizeChange} options={bookSizeOptions} placeholder="Select Your Book Size" />
                      <SelectInput id="page-count" value={pageCount} onChange={handlePageCountChange} options={pageCountOptions} placeholder="Page Count" />
                    </div>
                  </div>

                  {/* Binding Type */}
                  <div className="config-section">
                    <h3 className="config-title">Binding Type</h3>
                    <div className="binding-section">
                      <h4 className="binding-title">Paperback Options</h4>
                      <div className="options-grid">
                        {paperbackOptions.map(opt => (
                          <RadioOption key={opt.id} {...opt} name="bindingType" checked={bindingType === opt.value} onChange={handleBindingChange} />
                        ))}
                      </div>
                    </div>
                    <div className="binding-section">
                      <h4 className="binding-title">Hardcover Options</h4>
                      <div className="options-grid">
                        {hardcoverOptions.map(opt => (
                          <RadioOption key={opt.id} {...opt} name="bindingType" checked={bindingType === opt.value} onChange={handleBindingChange} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interior Color */}
                  <div className="config-section">
                    <h3 className="config-title">Interior Color</h3>
                    <div className="options-grid options-grid-4">
                      {colorOptions.map(opt => (
                        <RadioOption key={opt.id} {...opt} name="interiorColor" checked={interiorColor === opt.value} onChange={handleInteriorColorChange} />
                        ))}
                    </div>
                  </div>

                  {/* Paper Type */}
                  <div className="config-section">
                    <h3 className="config-title">Paper Type</h3>
                    <div className="options-grid">
                      {paperOptions.map(opt => (
                        <RadioOption key={opt.id} {...opt} name="paperType" checked={paperType === opt.value} onChange={handlePaperTypeChange} />
                        ))}
                    </div>
                  </div>

                  {/* Cover Finish */}
                  <div className="config-section last-section-config">
                    <h3 className="config-title">Cover Finish</h3>
                    <div className="options-grid options-grid-2">
                      {finishOptions.map(opt => (
                        <RadioOption key={opt.id} {...opt} name="coverFinish" checked={coverFinish === opt.value} onChange={handleCoverFinishChange} />
                        ))}
                  </div>
                  </div>

              </div> {/* End of print-book-config */}


              {/* --- Quantity & Shipping Estimates Section --- */}
              {/* This section remains the same structure */}
              <div className={`collapsible-section ${showShippingEstimates ? 'is-open' : ''}`}>
                <div className="collapsible-header" onClick={toggleShippingEstimates}>
                  <h3 className="collapsible-title">Quantity & Shipping Estimates</h3>
                  <svg className="collapsible-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
              </div>
                {showShippingEstimates && (
                  <div className="collapsible-content">
                    <p>Enter quantity and destination to get shipping estimates.</p>
                    <div className="input-group">
                      <input type="number" placeholder="Quantity" className="select-input" value={quantity} onChange={handleQuantityChange} />
                      <SelectInput id="country" value={selectedCountry} onChange={handleCountryChange} options={countryOptions} placeholder="Select Country" />
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                    Estimated Shipping: {shippingEstimate !== null ? `$${shippingEstimate} USD` : 'Calculate Above'}
                  </p>
                </div>
              )}
            </div>


             {/* --- Revenue Estimates Section --- */}
              {/* This section remains the same structure */}
            <div className={`collapsible-section ${showRevenueEstimates ? 'is-open' : ''}`}>
              <div className="collapsible-header" onClick={toggleRevenueEstimates}>
                <h3 className="collapsible-title">Revenue Estimates</h3>
                  <svg className="collapsible-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
              </div>
               {showRevenueEstimates && (
                <div className="collapsible-content">
                  <p>Calculate potential revenue based on price and estimated sales.</p>
                  <div className="input-group">
                      <input type="number" placeholder="Estimated Sales Quantity" className="select-input" value={estimatedSales} onChange={handleEstimatedSalesChange} />
                  </div>
                   <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                    Estimated Revenue: {estimatedRevenue !== null ? `$${estimatedRevenue} USD` : 'Calculate Above'}
                   </p>
                </div>
              )}
            </div>

          </div> {/* End of left-column */}


          {/* --- Right Summary Panel --- */}
          {/* Use the original summary panel class */}
          <div className="print-book-summary">
            <div className="summary-preview">
              {/* Image might need to be dynamic based on activeOption and other selections */}
              <img src={bookPreviewImg} alt={`${formatOptionLabel(activeOption)} Preview`} className="book-preview-image" />
              {/* Pages indicator might be specific to book types */}
              <div className="pages-indicator">
                <div className="pages-badge">{pageCount || 'N/A'} Pages</div>
              </div>
              {/* Distribution badge might be specific */}
              <div className="distribution-badge">Distribution Eligible</div>
            </div>

            <div className="summary-details">
              {/* Summary details rows - these display the selected values */}
              {/* Note: These labels and displayed values are based on the current state variables,
                which are named according to 'Print Book' config. This structure assumes
                all product types use these same configuration concepts (Size, Pages, Binding, etc.).
              */}
              <div className="summary-detail-row">
                <div className="summary-detail">
                  <div className="detail-label">Book Size</div> {/* Could be dynamic if needed */}
                  <div className="detail-value">{bookSizeMap[selectedBookSize] || 'Not Selected'}</div> {/* Using Print Book map */}
                </div>
                <div className="summary-detail">
                  <div className="detail-label">Page Count</div> {/* Could be dynamic if needed */}
                  <div className="detail-value">{pageCount ? `${pageCount} Pages` : 'Not Selected'}</div>
                </div>
              </div>
              <div className="summary-detail-row">
                <div className="summary-detail">
                  <div className="detail-label">Binding Type</div> {/* Could be dynamic if needed */}
                  <div className="detail-value">{bindingMap[bindingType] || 'Not Selected'}</div> {/* Using Print Book map */}
                </div>
                <div className="summary-detail">
                  <div className="detail-label">Interior Color</div> {/* Could be dynamic if needed */}
                  <div className="detail-value">{interiorColorMap[interiorColor] || 'Not Selected'}</div> {/* Using Print Book map */}
                </div>
              </div>
              <div className="summary-detail-row">
                <div className="summary-detail">
                  <div className="detail-label">Paper Type</div> {/* Could be dynamic if needed */}
                  <div className="detail-value">{paperTypeMap[paperType] || 'Not Selected'}</div> {/* Using Print Book map */}
                </div>
                <div className="summary-detail">
                  <div className="detail-label">Cover Finish</div> {/* Could be dynamic if needed */}
                  <div className="detail-value">{coverFinishMap[coverFinish] || 'Not Selected'}</div> {/* Using Print Book map */}
                </div>
              </div>
            </div>

            <div className="summary-actions"> {/* Actions buttons remain the same structure */}
              {/* These button texts could also be dynamic if needed */}
              <button className="btn btn-gradient"> Book Templates <svg className="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
              <button className="btn btn-gradient"> Custom Cover Template <svg className="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
              <button className="btn btn-primary" 
              onClick={handleCreateYourBook} 
              disabled={isPriceLoading || isAddingToCart}> 
              {isAddingToCart ? 'Adding to Cart...' : `Create Your ${formatOptionLabel(activeOption)}`}</button>
            </div>
             {/* Display Add to Cart Error below the button */}
             {addToCartError && (
                 <div className="add-to-cart-error-message" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                     {addToCartError}
                 </div>
             )}

            <div className="summary-price">
                {/* Display loading, error, or price */}
                {isPriceLoading ? (
                    <div className="price-value">Loading...</div>
                ) : priceError ? (
                    <div className="price-error">{priceError}</div>
                ) : (
                    <div className="price-value">{calculatedPrice} USD</div>
                )}
              {/* Dynamic price label */}
              <div className="price-label">Per {formatOptionLabel(activeOption)}</div>
            </div>
          </div> {/* End of print-book-summary */}

        </div> {/* End of print-book-container */}
      </div>
    );


      default:
        // Fallback for any unexpected activeOption value
        return (
          <div className="default-content fade-in">
            <h2>Select a Product Type</h2>
            <p>Please select a product type from the menu above to see the calculation options.</p>
          </div>
        );
    }
  };

  return (
    <section className="body-content">
      <div className="container">
        <div
          className="content-wrapper"
          role="tabpanel"
          // These can potentially be dynamic if needed for accessibility based on activeOption
          // id={`panel-${activeOption}`}
          // aria-labelledby={`tab-${activeOption}`}
        >
          {/* Call the conditional renderContent function */}
          {renderContent()}
        </div>
      </div>
    </section>
  );
};

export default BodyContent;