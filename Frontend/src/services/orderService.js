// src/services/orderService.js
import api from './api'; // Import your configured Axios instance

// --- Toggle for Dummy Data ---
// Set to true to use dummy data, set to false to make real API calls
const USE_DUMMY_DATA_ORDER = true;

/**
 * Sends the shipping address information to the backend API.
 * Uses dummy data when USE_DUMMY_DATA_ORDER is true.
 * @param {Object} shippingData - Object containing all shipping form details.
 * @returns {Promise<Object>} A promise that resolves with response data.
 */
export const submitShippingInfo = async (shippingData) => {
    if (USE_DUMMY_DATA_ORDER) {
        console.log('DUMMY DATA (Order): Simulating submitting shipping info:', shippingData);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('DUMMY DATA (Order): Dummy shipping info submitted successfully.');
                // Simulate a successful API response
                // In a real app, this might return confirmation or data for the next step (e.g., payment options)
                resolve({ success: true, message: 'Shipping info received (dummy).' });

                 // Uncomment below to simulate an error submitting shipping info
                // reject(new Error('DUMMY API Error: Shipping validation failed (dummy).'));

            }, 700); // Simulate 700ms network delay
        });
    } else {
        // --- Actual API Call ---
        console.log('API Call (Order): Submitting shipping info:', shippingData);
        try {
            // !! IMPORTANT: Replace '/checkout/submit-shipping' with your actual backend endpoint
            const response = await api.post('/checkout/submit-shipping', shippingData);
            console.log('API Response (Order): Shipping info submitted successfully:', response.data);
            return response.data; // Assuming backend response confirms success or provides next steps
        } catch (error) {
            console.error('API Error (Order): Failed to submit shipping info:', error.response?.data || error.message);
            throw error;
        }
    }
};

// Add other order/checkout related DUMMY API functions here (e.g., processPayment)
// export const processPayment = async (paymentDetails) => { /* ... */ };