// src/services/pricing.js
import api from './api'; // Import your configured Axios instance

// --- Toggle for Dummy Data ---
// Set to true to use dummy data, set to false to make real API calls
const USE_DUMMY_DATA_PRICING = true;

// --- Helper function for dummy calculation ---
const calculateDummyPrice = (config) => {
    let basePrice = 5.00;
    const pageCount = parseInt(config.pageCount || 0);

    if (config.bookSize === 'standard') basePrice += 1.00;
    if (config.bookSize === 'large') basePrice += 2.50;

    if (pageCount > 0) {
       basePrice += (pageCount / 100) * 1.50;
    }

    if (config.bindingType && config.bindingType.startsWith('hardcover')) basePrice += 4.00;
    if (config.bindingType === 'coil') basePrice += 0.50;
    if (config.bindingType === 'saddle') basePrice += 0.25;
    if (config.bindingType === 'linen') basePrice += 1.00;

    if (config.interiorColor && config.interiorColor.includes('premium')) basePrice += 1.50;
    if (config.interiorColor && config.interiorColor.includes('color') && pageCount > 0) {
        basePrice += (pageCount / 100) * 2.00;
    }

    if (config.paperType === '80-white') basePrice += 1.00;
    if (config.coverFinish === 'glossy') basePrice += 0.20;

    return parseFloat(basePrice.toFixed(2));
};


/**
 * Calculates a price based on item configuration.
 * Makes an API call when USE_DUMMY_DATA_PRICING is false,
 * otherwise returns dummy data via a simulated promise.
 * @param {Object} itemConfig - The configuration details for the item.
 * @returns {Promise<Object>} A promise that resolves with a price object.
 */
export const calculateBookPrice = async (itemConfig) => {
  if (USE_DUMMY_DATA_PRICING) {
    console.log('DUMMY DATA (Pricing): Calculating dummy price for:', itemConfig);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Use the dummy calculation helper
        const price = calculateDummyPrice(itemConfig);
        resolve({ price: price }); // Simulate a successful API response format
      }, 500); // Simulate 500ms network delay
    });
  } else {
    // --- Actual API Call (will be used when USE_DUMMY_DATA_PRICING is false) ---
    console.log('API Call (Pricing): Calculating price for:', itemConfig);
    try {
        // !! IMPORTANT: Replace '/calculate-price' with your actual backend endpoint
        const response = await api.post('/calculate-price', itemConfig);
        console.log('API Response (Pricing): Price received:', response.data);
        return response.data; // Assuming backend returns { price: number }
    } catch (error) {
        console.error('API Error (Pricing): Failed to calculate price:', error.response?.data || error.message);
        throw error; // Re-throw the error for component to handle
    }
  }
};