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
// Import API service functions (will be simulated with dummy data via Axios calls)
// You will need to create/implement these in your services file
import { fetchCartDetails, processPayment } from '../../services/api';

// Import icons if needed (e.g., for card types - not implemented in this basic skeleton)
// import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcDiscover } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi'; // Keep for Cart Summary Edit link

// Import CSS (will be created based on this JSX structure)
import './PaymentPage.css';
import cartitemimage from '../../assets/cart-item-image.png';

// --- Dummy Data Simulation ---
// In a real app, this would be handled by your backend.
// For this dummy implementation, we'll simulate cart data and payment processing.

// Dummy cart data (This should ideally be managed in a shared service or state)
// For demonstration, we'll use a simple structure.
// In a real scenario, fetchCartDetails would get this from a backend or shared state.
let dummyCartData = {
    items: [
        { id: 'item1', name: 'Custom Print Book', quantity: 2, configurationSummary: 'Pocket, 100 Pages, Case Wrap', price: 80.49, imageUrl: 'path/to/dummy-book-image.png' },
        // Add more dummy items as needed
    ],
    subtotal: 160.98, // Example calculation based on dummy items
    taxes: 10.50, // Example dummy tax
    total: 171.48, // Example dummy total (subtotal + taxes)
    orderId: 'dummy-order-12345', // Example dummy order ID
    // In a real app, this might also include shipping cost and applied discount
    shippingCost: 15.00, // Dummy shipping cost
    discountAmount: 0.00, // Dummy discount
};

// Simulate fetching cart details
const simulateFetchCartDetails = async () => {
    console.log('Simulating API call: fetchCartDetails');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return dummy data
    return { data: dummyCartData };
};

// Simulate processing payment
const simulateProcessPayment = async (paymentData) => {
    console.log('Simulating API call: processPayment with data:', paymentData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate payment success or failure based on dummy logic
    // For example, simulate failure if card number is "1111"
    if (paymentData.paymentMethod === 'credit_card' && paymentData.cardNumber.startsWith('1111')) {
        console.error('Simulating payment failure');
        const error = new Error('Simulated payment declined.');
        error.response = { data: { message: 'Payment processing failed. Please check your details.' } };
        throw error;
    }

    console.log('Simulating payment success');
    // Simulate successful payment response
    return { data: { success: true, transactionId: 'dummy-txn-abc789' } };
};

// --- Replace actual API calls with simulated ones for now ---
// In your actual services/api.js file, you would use axios.get('/api/cart') etc.
// For this dummy setup within the component file, we'll just use the simulated functions.
// In a real scenario, these functions would be in your services file and use Axios to call your backend.
// const fetchCartDetails = simulateFetchCartDetails; // This would be the actual axios call in services/api.js
// const processPayment = simulateProcessPayment; // This would be the actual axios.post('/api/process-payment') in services/api.js


const PaymentPage = () => {
    const navigate = useNavigate();
    // const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

    // State for Cart and Order Details
    const [cart, setCart] = useState(null);
    // State for Payment Method Selection
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');

    // State for Credit Card Form Inputs
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');
    // Add state for billing address if different

    // State for API Call Status
    const [isLoading, setIsLoading] = useState(true); // For initial data fetch
    const [isProcessingPayment, setIsProcessingPayment] = useState(false); // For payment submission
    const [error, setError] = useState(null); // For initial load errors
    const [paymentError, setPaymentError] = useState(null); // For payment processing errors

    // --- Effects ---
    useEffect(() => {
        const loadOrderDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Use the simulated fetchCartDetails function
                const response = await simulateFetchCartDetails(); // Use the simulated function
                const cartData = response.data; // Access data from simulated response
                setCart(cartData);
                console.log('Fetched cart details for Payment Page:', cartData);

            } catch (err) {
                console.error('Failed to load order details for payment:', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        loadOrderDetails(); // Call fetch function on component mount
    }, []);


    // --- Handlers ---
    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        // Clear form fields and errors when method changes
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setCardName('');
        setPaymentError(null);
    };

    const handlePaymentSubmit = async (event) => {
        event.preventDefault();

        setPaymentError(null); // Clear previous payment errors

        // Basic Frontend Validation based on selected method
        if (selectedPaymentMethod === 'credit_card') {
            if (!cardNumber || !expiryDate || !cvv || !cardName) {
                setPaymentError('Please fill in all required credit card details.');
                return;
            }
            // Add more validation (card number format, expiry format, CVV length)
        } else if (selectedPaymentMethod === 'paypal') {
             // Add PayPal specific validation if needed
        } else {
             setPaymentError('Please select a payment method.');
             return;
        }


        setIsProcessingPayment(true);
        // Clear general errors, but keep paymentError separate
        // setError(null);

        // Gather payment data based on the selected method
        const paymentData = {
            paymentMethod: selectedPaymentMethod,
            orderId: cart?.orderId, // Pass order ID from fetched cart data
            ...(selectedPaymentMethod === 'credit_card' && {
                cardNumber,
                expiryDate,
                cvv,
                cardName,
                // billingAddress: {...} // Include if different from shipping
            }),
            // Add PayPal specific data if needed (e.g., token from a PayPal integration)
        };

        console.log('Submitting payment information:', paymentData);

        try {
            // Use the simulated processPayment function
            const response = await simulateProcessPayment(paymentData); // Use the simulated function
            const paymentResponse = response.data; // Access data from simulated response
            console.log('Payment processing response:', paymentResponse);

            // Assuming a successful response indicates successful payment
            if (paymentResponse.success) {
                 console.log('Payment successful, navigating to order confirmation...');
                 // !! IMPORTANT: Navigate to the next checkout step (e.g., /checkout/confirmation)
                 navigate('/checkout/confirmation'); // <-- Update this route
            } else {
                 // Handle cases where success is false but no error was thrown
                 setPaymentError(paymentResponse.message || 'Payment failed.');
            }


        } catch (err) {
            console.error('Payment processing failed:', err);
            // Display the error message from the simulated API response or a default
            setPaymentError(err.response?.data?.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessingPayment(false); // Turn off processing state
        }
    };


    // Handler for the Cancel button
    const handleCancelPayment = () => {
        console.log('Payment cancelled, navigating back...');
        // Decide where to navigate on cancel (e.g., back to cart or shipping)
        navigate('/cart'); // Example: navigate back to cart
    };


    // --- Render Loading/Error States for initial load ---
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

    // Handle case where cart/order is unexpectedly empty at this stage
    if (!cart || !cart.items || cart.items.length === 0) {
         return (
             <div className="payment-page-container empty-order">
                 <h2>Order Not Found or Empty</h2>
                 <p>There was an issue loading your order details. Please return to the cart.</p>
                 <Link to="/cart">Go to Cart</Link>
             </div>
         );
    }


    // --- JSX Rendering for the Payment Page ---
    return (
        <div className="payment-page-container">
            <div className="top-area">
                {/* Checkout Header Area - Similar to ShippingPage */}
                 <div className="checkout-header-area">
                    <div className="checkout-header-top">
                        <Link to="/shop" className="checkout-shop-link">Shop</Link>
                        {/* Link back to shipping page */}
                        <Link to="/checkout/shipping" className="checkout-back-link">← Back To Shipping</Link>
                    </div>
                    {/* Step 3 of 3 */}
                    <CheckoutStepIndicator currentStep={3} totalSteps={3} />
                </div>
            </div>

            {/* Main Content Area (Payment Form and Order Summary) */}
            {/* Reusing checkout-content-area and checkout-content-inner for layout consistency */}
            <div className="checkout-content-area">
                 <div className="checkout-content-inner">

                    {/* Left side: Payment Information */}
                    <div className="payment-form-area"> {/* New class for the payment form container */}
                         <h2>Payment Information</h2>
                         <p className="payment-info-subtitle">All Transactions Are Secure And Encrypted</p>

                         {/* Payment Method Selection */}
                         <div className="payment-methods"> {/* New class for payment methods section */}
                             <label className="payment-method-option"> {/* New class for each option label */}
                                 <input
                                     type="radio"
                                     name="paymentMethod"
                                     value="credit_card"
                                     checked={selectedPaymentMethod === 'credit_card'}
                                     onChange={() => handlePaymentMethodChange('credit_card')}
                                 />
                                 Credit Card
                                 {/* Add card icons here */}
                                  <div className="card-icons"> {/* New class for card icons */}
                                      {/* Using placeholder images for now */}
                                       <img src={visa} alt="Visa" />
                                       <img src={mastercard} alt="Mastercard" />
                                       <img src={americanexpress} alt="American Express" />
                                  </div>
                             </label>
                             <label className="payment-method-option">
                                 <input
                                     type="radio"
                                     name="paymentMethod"
                                     value="paypal"
                                     checked={selectedPaymentMethod === 'paypal'}
                                     onChange={() => handlePaymentMethodChange('paypal')}
                                 />
                                 Paypal
                                 {/* Add PayPal logo here */}
                                 <div className="paypal-logo"> {/* New class for PayPal logo */}
                                     {/* Using placeholder image for now */}
                                     <img src={paypal} alt="PayPal" />
                                 </div>
                             </label>
                         </div>

                         {/* Payment Form Fields (Conditional based on selected method) */}
                         <form className="payment-form" onSubmit={handlePaymentSubmit}> {/* New class for the payment form */}

                             {paymentError && (
                                <div className="error-message" role="alert"> {/* Reuse error message styling */}
                                    {paymentError}
                                </div>
                             )}

                             {selectedPaymentMethod === 'credit_card' && (
                                 <div className="credit-card-fields"> {/* New class for CC fields container */}
                                      {/* Card Number */}
                                     <div className="form-group"> {/* Reuse form-group styling */}
                                         <label htmlFor="cardNumber">Card Number</label>
                                         <input
                                             type="text"
                                             id="cardNumber"
                                             value={cardNumber}
                                             onChange={(e) => setCardNumber(e.target.value)}
                                             required={selectedPaymentMethod === 'credit_card'}
                                             placeholder="0000 0000 0000 0000"
                                         />
                                     </div>

                                      {/* Expiry Date and CVV */}
                                     <div className="form-row"> {/* Reuse form-row styling */}
                                          <div className="form-group">
                                             <label htmlFor="expiryDate">Expiry Date</label>
                                             <input
                                                 type="text"
                                                 id="expiryDate"
                                                 value={expiryDate}
                                                 onChange={(e) => setExpiryDate(e.target.value)}
                                                 required={selectedPaymentMethod === 'credit_card'}
                                                 placeholder="MM/YY"
                                             />
                                          </div>
                                           <div className="form-group">
                                             <label htmlFor="cvv">CVV</label>
                                             <input
                                                 type="text"
                                                 id="cvv"
                                                 value={cvv}
                                                 onChange={(e) => setCvv(e.target.value)}
                                                 required={selectedPaymentMethod === 'credit_card'}
                                                 placeholder="XXX"
                                             />
                                          </div>
                                     </div>

                                      {/* Name on Card */}
                                      <div className="form-group">
                                         <label htmlFor="cardName">Name on Card</label>
                                         <input
                                             type="text"
                                             id="cardName"
                                             value={cardName}
                                             onChange={(e) => setCardName(e.target.value)}
                                             required={selectedPaymentMethod === 'credit_card'}
                                             placeholder="Full Name"
                                         />
                                     </div>

                                      {/* Billing Address if different (Add similar form groups as in ShippingPage) */}
                                      {/* ... */}
                                 </div>
                             )}

                             {selectedPaymentMethod === 'paypal' && (
                                 <div className="paypal-info"> {/* New class for PayPal specific info/button */}
                                     <p>You will be redirected to PayPal to complete your purchase.</p>
                                     {/* In a real integration, this might be a PayPal button */}
                                     {/* <button type="button" className="paypal-button">Proceed to PayPal</button> */}
                                 </div>
                             )}


                              {/* Action Buttons */}
                             <div className="payment-buttons"> {/* New class for button container */}
                                  <button type="button" className="btn btn-secondary" onClick={handleCancelPayment}> {/* Reuse button styling, add secondary class for Cancel */}
                                     Cancel
                                 </button>
                                 <button
                                     type="submit"
                                     disabled={isProcessingPayment || !selectedPaymentMethod || (selectedPaymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv || !cardName))}
                                     className="btn btn-primary"
                                 > {/* Reuse primary button styling */}
                                     {isProcessingPayment ? 'Processing...' : 'Confirm Payment'}
                                 </button>
                            </div>
                         </form>
                    </div>

                    {/* Right side: Order Summary (similar to Cart Summary) */}
                    {/* Reusing cart-summary-area class and its internal structure/styling */}
                    {/* This structure should match the final version from the ShippingPage */}
                     <div className="cart-summary-area">
                         <div className="cart-summary-header">
                             <h2>Order Summary</h2> {/* Updated title */}
                             {/* No Edit link needed on Payment page based on design */}
                             {/* <Link to="/cart" className="edit-cart-link">Edit <FiExternalLink className="edit-icon" /></Link> */}
                         </div>

                         {/* Display Shipping Address Summary if needed here */}
                          {/* <div className="shipping-summary"> ... </div> */}

                         {/* Cart Items Container (Pale blue section) */}
                         <div className="cart-items-container">
                             {/* Display Cart Items */}
                             {cart && cart.items && cart.items.map(item => (
                                 <div key={item.id} className="cart-item">
                                    {/* Item structure */}
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

                         {/* Discount Section */}
                          {/* In the payment summary, you usually just display the applied discount */}
                          {/* The input/apply button might not be present here based on typical flows */}
                           <div className="discount-section">
                               <span>Discount Applied: ${dummyCartData.discountAmount?.toFixed(2) || '0.00'}</span> {/* Display dummy discount */}
                           </div>


                         {/* Totals Section */}
                         {cart && (
                            <div className="totals-section">
                                 <div className="total-row">
                                     <span>Subtotal</span>
                                     <span>${cart.subtotal?.toFixed(2) || '0.00'} USD</span>
                                 </div>
                                  {/* Add Shipping Cost row here if available in cart/order data */}
                                   <div className="total-row">
                                       <span>Shipping</span>
                                        {/* Display dummy shipping cost */}
                                       <span>${dummyCartData.shippingCost?.toFixed(2) || '0.00'} USD</span>
                                   </div>
                                  <div className="total-row">
                                     <span>Taxes</span>
                                     <span>${cart.taxes?.toFixed(2) || '0.00'} USD</span>
                                 </div>
                                  <div className="total-row total-line">
                                     <span>Order Total</span> {/* Label updated */}
                                     {/* Display the final total including shipping and discount */}
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