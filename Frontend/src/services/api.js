// src/services/api.js
import axios from 'axios';

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

export const fetchCartDetails = async () => {
    if (USE_DUMMY_DATA_API) {
        console.log('DUMMY DATA (API): Fetching dummy cart details...');
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const dummyCartData = {
                    items: [
                        {
                            id: 'item-abc',
                            productId: 'print-book',
                            name: 'Custom Print Book',
                            configurationSummary: 'Pocket, 100 Pages, Case Wrap',
                            quantity: 1,
                            price: 80.49,
                            imageUrl: 'https://via.placeholder.com/80x100?text=Book'
                        }
                    ],
                    subtotal: 80.49,
                    taxes: 0.00,
                    total: 80.49
                };
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
