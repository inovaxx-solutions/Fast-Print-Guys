// src/services/api.js
import axios from 'axios';
import { calculateBookPrice } from './pricing'; // Import the pricing function

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this base URL to your backend API endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});
const USE_DUMMY_DATA_API = true;


export const fetchLoggedInUser = async () => {
  try {
    const token = localStorage.getItem('authToken'); // Get the token from local storage
    if (!token) {
      throw new Error('No token found'); // Handle case where token is not available
    }

    // Set the Authorization header with the token
    const response = await api.get('/user/me', {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the request headers
      },
    });

    return response.data; // Return the user data from the response
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    throw error; // Rethrow the error to be handled in the calling function
  }
};

export const fetchCartItemCount = async () => {
  if (USE_DUMMY_DATA_API) {
    console.log('DUMMY DATA (API): Fetching dummy cart item count...');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ count: 2 });
      }, 300);
    });
  } else {
    console.log('API Call (API): Fetching cart item count...');
    try {
      const response = await api.get('/cart/count'); // Replace '/cart/count'
      if (response.data && typeof response.data.count === 'number') {
        console.log('API Response (API): Successfully fetched count.', response.data.count);
        return response.data.count;
      } else {
        console.error('API Response (API): Cart count API returned unexpected data format:', response.data);
        return 0;
      }
    } catch (error) {
      console.error('API Error (API): Error fetching cart item count:', error.response?.data || error.message);
      return 0;
    }
  }
};

export const fetchCartDetails = async (selectedState) => { // Accept 'selectedState' as an argument
  if (USE_DUMMY_DATA_API) {
    console.log('DUMMY DATA (API): Fetching dummy cart details...');
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        // --- Retrieve customizations from Local Storage ---
        const storedCustomizations = localStorage.getItem('bookCustomizations');
        let customizations = null;
        let quantity = 1; // Default quantity
        if (storedCustomizations) {
          customizations = JSON.parse(storedCustomizations);
          quantity = parseInt(customizations.quantity, 10) || 1; // Get quantity from customizations
        }

        const dummyCartData = {
          items: [
            {
              id: 'item-abc',
              productId: 'print-book',
              name: (() => {
                if (customizations) {
                  switch (customizations.activeOption) {
                    case 'photo-book':
                      return 'Custom Photo Book';
                    case 'comic-book':
                      return 'Custom Comic Book';
                    case 'magazine':
                      return 'Custom Magazine';
                    case 'yearbook':
                      return 'Custom Yearbook';
                    case 'calendar':
                      return 'Custom Calendar';
                    case 'thesis-binding':
                      return 'Thesis Binding';
                    default:
                      return 'Custom Print Book';
                  }
                } else {
                  return 'Custom Print Book'; // Default if no customizations found
                }
              })(),
              // --- Use retrieved customizations if available, otherwise default ---
              configuration: customizations || {
                activeOption: 'print-book',
                selectedBookSize: 'pocketbook',
                pageCount: '100',
                bindingType: 'case',
                interiorColor: 'standard-bw',
                paperType: '60-white',
                coverFinish: 'matte',
              },
              quantity: quantity, // Use the quantity retrieved from localStorage
              imageUrl: 'https://via.placeholder.com/80x100?text=Book'
            },
            // Add more dummy items with their configurations
          ],
          subtotal: 0,
          taxes: 0, // Initialize taxes to 0
          shippingCost: 10.00,
          discountAmount: 0.00,
          total: 0
        };

        // Calculate price for each item using calculateBookPrice
        for (const item of dummyCartData.items) {
          item.price = await calculateBookPrice(item.configuration).then(res => res.price);
          dummyCartData.subtotal += item.price * item.quantity;
        }

        // Apply discount (if any)
        if (dummyCartData.items.reduce((sum, item) => sum + item.quantity, 0) > 100) {
          dummyCartData.discountAmount = dummyCartData.subtotal * 0.10;
        }
        dummyCartData.subtotal -= dummyCartData.discountAmount;

        // Calculate taxes based on the selected state
        if (selectedState === 'Texas') {
          dummyCartData.taxes = parseFloat((dummyCartData.subtotal * 0.0825).toFixed(2));
        } else {
          dummyCartData.taxes = 0.00; // No tax for other states in this dummy logic
        }

        // Calculate total
        dummyCartData.total = dummyCartData.subtotal + dummyCartData.taxes + dummyCartData.shippingCost;
        dummyCartData.total = parseFloat(dummyCartData.total.toFixed(2));
        dummyCartData.subtotal = parseFloat(dummyCartData.subtotal.toFixed(2));
        dummyCartData.taxes = parseFloat(dummyCartData.taxes.toFixed(2));
        dummyCartData.shippingCost = parseFloat(dummyCartData.shippingCost.toFixed(2));
        dummyCartData.discountAmount = parseFloat(dummyCartData.discountAmount.toFixed(2));

        resolve(dummyCartData);
      }, 800);
    });
  } else {
    console.log('API Call (API): Fetched cart details...');
    try {
      const response = await api.get('/cart/details'); // !! IMPORTANT: Replace '/cart/details'
      console.log('API Response (API): Fetched cart details:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error (API): Failed to fetch cart details:', error.response?.data || error.message);
      throw error;
    }
  }
};

export const addToCart = async (itemDetails) => {
  if (USE_DUMMY_DATA_API) {
    console.log('DUMMY DATA (API): Simulating adding item to cart:', itemDetails);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('DUMMY DATA (API): Dummy add to cart successful.');
        resolve({ success: true, message: 'Item added successfully (dummy).' });
      }, 600);
    });
  } else {
    console.log('API Call (API): Adding item to cart:', itemDetails);
    try {
      const response = await api.post('/cart/add', itemDetails); // !! IMPORTANT: Replace '/cart/add'
      console.log('API Response (API): Item added to cart:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error (API): Failed to add item to cart:', error.response?.data || error.message);
      throw error;
    }
  }
};

export const processPayment = async (paymentData) => {
  if (USE_DUMMY_DATA_API) {
    console.log('DUMMY DATA (API): Simulating payment processing:', paymentData);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (paymentData.paymentMethod === 'credit_card' && paymentData.cardNumber.startsWith('1111')) {
          console.error('DUMMY DATA (API): Simulating payment failure.');
          const error = new Error('Simulated payment declined.');
          error.response = { data: { message: 'DUMMY API Error: Payment processing failed. Please check your details.' } };
          reject(error);
        } else if (paymentData.paymentMethod === 'paypal') {
          console.log('DUMMY DATA (API): Simulating PayPal processing (success).');
          resolve({ success: true, message: 'Dummy PayPal processing successful.', transactionId: 'dummy-paypal-txn-123' });
        }
        else {
          console.log('DUMMY DATA (API): Simulating credit card payment success.');
          resolve({ success: true, message: 'Dummy payment successful.', transactionId: 'dummy-cc-txn-456' });
        }

      }, 1000);
    });
  } else {
    console.log('API Call (API): Processing payment:', paymentData);
    try {
      const response = await api.post('/process-payment', paymentData); // !! IMPORTANT: Replace '/process-payment'
      console.log('API Response (API): Payment processing result:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error (API): Failed to process payment:', error.response?.data || error.message);
      throw error;
    }
  }
};

export default api;