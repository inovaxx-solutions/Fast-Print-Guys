// src/services/pricing.js
 import api from './api'; // Import your configured Axios instance

 // --- Toggle for Dummy Data ---
 // Set to true to use dummy data, set to false to make real API calls
 const USE_DUMMY_DATA_PRICING = true;

 // --- Helper function for dummy calculation ---
 const calculateDummyPrice = (config) => {
  let basePrice = 0.00;
  const pageCount = parseInt(config.pageCount || 0);

  if (config.activeOption === 'print-book') {
    const prices = {
      'pocketbook': { perfect: 1.91, saddle: 3.59, case: 9.86, linen: 6.00, coil: 5.90 },
      'novella': { perfect: 1.97, saddle: 3.50, case: 9.80, linen: null, coil: 5.76 },
      'digest': { perfect: 1.90, saddle: 3.50, case: 9.80, linen: 13.75, coil: 5.95 },
      'a5': { perfect: 1.90, saddle: 3.46, case: 9.80, linen: 13.75, coil: 5.80 },
      'us_trade': { perfect: 1.71, saddle: 3.46, case: 9.96, linen: 13.50, coil: 5.96 },
      'royal': { perfect: 1.71, saddle: 3.46, case: 9.96, linen: 13.50, coil: 5.96 },
      'executive': { perfect: 2.00, saddle: 4.10, case: 10.00, linen: 13.95, coil: 6.40 },
      'crown_quarto': { perfect: 2.00, saddle: 4.10, case: 10.00, linen: 13.95, coil: 6.40 },
      'a4': { perfect: 2.10, saddle: 3.82, case: 9.75, linen: 13.80, coil: 6.18 },
      'square': { perfect: 2.00, saddle: 3.82, case: 9.75, linen: 13.80, coil: 6.18 },
      'us_letter': { perfect: 2.00, saddle: 3.82, case: 9.75, linen: 13.80, coil: 6.18 },
      'small_landscape': { perfect: 2.00, saddle: 3.82, case: 9.75, linen: 13.80, coil: 6.18 },
      'us_letter_landscape': { perfect: 2.00, saddle: 3.82, case: 9.75, linen: 18.00, coil: 6.22 },
      'a4_landscape': { perfect: 2.00, saddle: 3.82, case: 9.75, linen: 18.00, coil: 6.22 },
    };
    const colorPrices = { 'standard-bw': 0.01, 'premium-bw': 0.02, 'standard-color': 0.03, 'premium-color': 0.04 };
    const paperPrices = { '60-cream': 0.01, '60-white': 0.01, '80-white': 0.02 };
    const finishPrices = { 'glossy': 0.10, 'matte': 0.10 };

    basePrice += prices[config.selectedBookSize]?.[config.bindingType] || 0;
    basePrice += finishPrices[config.coverFinish] || 0;
    basePrice += (pageCount * ((colorPrices[config.interiorColor] || 0) + (paperPrices[config.paperType] || 0)));

  } else if (config.activeOption === 'photo-book') {
    const prices = {
      'pocketbook': { perfect: 1.40, case: 9.10, coil: 5.90 },
      'novella': { perfect: 1.97, case: 9.80 },
      'digest': { perfect: 1.97, case: 9.10, linen: 14.00 },
      'a5': { perfect: 1.97, case: 9.10, linen: 14.00 },
      'us_trade': { perfect: 1.97, case: 9.10, linen: 14.00 },
      'royal': { perfect: 3.00, case: 9.50, linen: 14.00 },
      'executive': { perfect: 3.00, case: 9.50 },
      'crown_quarto': { perfect: 3.00, case: 9.50 },
      'a4': { perfect: 3.00, case: 9.50, linen: 14.00 },
      'square': { perfect: 3.00, case: 9.50, linen: 14.00 },
      'us_letter': { perfect: 3.00, case: 9.50, linen: 14.00 },
      'small_landscape': { perfect: 3.00, case: 9.50, linen: 14.00 },
      'us_letter_landscape': { perfect: 3.00, case: 9.50, linen: 14.00 },
      'a4_landscape': { perfect: 3.00, case: 9.50, linen: 14.00 },
    };
    const colorPrices = { 'premium-bw': 0.02, 'premium-color': 0.10 };
    const paperPrices = { '60-white': 0.01, '80-white': 0.03 };

    basePrice += prices[config.selectedBookSize]?.[config.bindingType] || 0;
    basePrice += (pageCount * ((colorPrices['premium-' + config.interiorColor.split('-').pop()] || 0) + (paperPrices[config.paperType] || 0)));

  } else if (config.activeOption === 'comic-book') {
    const prices = {
      'comic': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
      'larger-deluxe': { perfect: 3.00, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
      'manga': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
    };
    const colorPrices = { 'premium-bw': 0.03, 'premium-color': 0.19 };
    const paperPrices = { '70-white': 0.02, '60-cream': 0.01, '60-white': 0.01, '80-white': 0.03 };

    basePrice += prices[config.selectedBookSize]?.[config.bindingType] || 0;
    basePrice += (pageCount * ((colorPrices['premium-' + config.interiorColor.split('-').pop()] || 0) + (paperPrices[config.paperType] || 0)));

  } else if (config.activeOption === 'magazine') {
    const prices = {
      'a4': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
      'us_letter': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
    };
    const colorPrices = { 'premium-bw': 0.03, 'premium-color': 0.19 };
    const paperPrices = { '70-white': 0.02, '60-cream': 0.01, '60-white': 0.01, '80-white': 0.03 };

    basePrice += prices[config.selectedBookSize]?.[config.bindingType] || 0;
    basePrice += (pageCount * ((colorPrices['premium-' + config.interiorColor.split('-').pop()] || 0) + (paperPrices[config.paperType] || 0)));

  } else if (config.activeOption === 'yearbook') {
    const prices = {
      'a4': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
      'us_letter': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
      'us_letter_landscape': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
      'a4_landscape': { perfect: 2.50, saddle: 5.00, case: 9.75, linen: 13.80, coil: 6.18 },
    };
    const colorPrices = { 'premium-bw': 0.03, 'premium-color': 0.19 };
    const paperPrices = { '70-white': 0.02, '60-cream': 0.01, '60-white': 0.01, '80-white': 0.03 };

    basePrice += prices[config.selectedBookSize]?.[config.bindingType] || 0;
    basePrice += (pageCount * ((colorPrices['premium-' + config.interiorColor.split('-').pop()] || 0) + (paperPrices[config.paperType] || 0)));

  } else if (config.activeOption === 'thesis-binding') {
    const prices = {
      'a4': { leather: 79.00, 'faux-leather': 69.00, polythin: 59.00, spineRound: 5.00, spineFlat: 0.00, colorBlack: 5.00, colorBrown: 3.00, colorMaroon: 5.00, colorDarkBlue: 5.00, foilGolden: 10.00, foilSilver: 15.00, screenGolden: 10.00, screenSilver: 15.00, cornerGoldSharp: 4.00, cornerGoldRound: 4.00, cornerVintage: 6.00 },
      'us_letter': { leather: 79.00, 'faux-leather': 69.00, polythin: 59.00, spineRound: 5.00, spineFlat: 0.00, colorBlack: 5.00, colorBrown: 3.00, colorMaroon: 5.00, colorDarkBlue: 5.00, foilGolden: 10.00, foilSilver: 15.00, screenGolden: 10.00, screenSilver: 15.00, cornerGoldSharp: 4.00, cornerGoldRound: 4.00, cornerVintage: 6.00 },
    };
    const colorPrices = { 'premium-bw': 0.03, 'premium-color': 0.19 };
    const paperPrices = { '70-white': 0.02, '60-cream': 0.01, '60-white-uncoated': 0.01, '80-white': 0.03 };

    basePrice += prices[config.selectedBookSize]?.[config.thesisBindingType] || 0;
    basePrice += prices[config.selectedBookSize]?.[`spine${config.thesisSpine.charAt(0).toUpperCase() + config.thesisSpine.slice(1)}`] || 0;
    basePrice += prices[config.selectedBookSize]?.[`color${config.thesisExteriorColor.charAt(0).toUpperCase() + config.thesisExteriorColor.slice(1)}`] || 0;
    basePrice += prices[config.selectedBookSize]?.[`foil${config.thesisFoilStamping.charAt(0).toUpperCase() + config.thesisFoilStamping.slice(1)}`] || 0;
    basePrice += prices[config.selectedBookSize]?.[`screen${config.thesisScreenStamping.charAt(0).toUpperCase() + config.thesisScreenStamping.slice(1)}`] || 0;
    basePrice += prices[config.selectedBookSize]?.[`corner${config.thesisCornerProtector.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`] || 0;
    basePrice += (pageCount * ((colorPrices['premium-' + config.thesisInteriorColor.split('-').pop()] || 0) + (paperPrices[config.thesisPaperType] || 0)));

  } else if (config.activeOption === 'calendar') {
    const prices = {
      'us_letter_landscape': { 'wire-o': 12.00 },
    };
    basePrice += prices[config.selectedBookSize]?.[config.bindingType] || 0;
  }

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

export default calculateBookPrice;