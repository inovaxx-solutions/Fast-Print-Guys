// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const shippingRouter = require('./routes/shipping.js');
const orderRoutes = require('./routes/order');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS & JSON parser
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));
app.use(express.json());

// 2. Connect MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅  MongoDB connected.'))
  .catch(err => console.error('❌  MongoDB connection error:', err));

// 3. Existing routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shipping', shippingRouter);

// 4. New order routes
app.use('/api/order', orderRoutes);

/**
 * 5. Unified Stripe Checkout endpoint
 *    You don't need to modify this except: now we assume
 *    the front end called /api/order/create-order first.
 */
app.post('/api/create-checkout-session', async (req, res) => {
  const { orderId, amount, paymentMethodType } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount is required.' });
  }

  try {
    const paymentMethods = paymentMethodType === 'stripe_link' ? ['card', 'link'] : ['card'];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: orderId ? `Order #${orderId}` : 'Book Printing Order'
          },
          unit_amount: amount
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        orderId: orderId || 'unknown',
        paymentMethod: paymentMethodType
      }
    });

    return res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create payment session' });
  }
});

/**
 * 6. Create PayPal order endpoint
 *    - Creates a PayPal order and returns approveUrl.
 *    - We do NOT capture yet; capturing happens in GET /api/order/paypal-capture.
 */
app.post('/api/create-paypal-order', async (req, res) => {
  const { amount, orderId } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });

  // Setup PayPal SDK client
  const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  const client = new paypal.core.PayPalHttpClient(environment);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      reference_id: orderId || 'order',
      amount: {
        currency_code: 'USD',
        value: (amount / 100).toFixed(2)
      }
    }],
    application_context: {
      return_url: `${process.env.CLIENT_URL}/checkout/paypal-callback?orderId=${orderId}`, 
      cancel_url: `${process.env.CLIENT_URL}/cart`
    }
  });

  try {
    const response = await client.execute(request);
    const approveUrl = response.result.links.find(link => link.rel === 'approve')?.href;
    if (!approveUrl) throw new Error('No approval link from PayPal');
    return res.json({ approveUrl, paypalOrderId: response.result.id });
  } catch (err) {
    console.error('PayPal Order Error:', err);
    return res.status(500).json({ error: 'PayPal order creation failed.' });
  }
});

// 7. Health check
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 8. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 CORS configured for: ${process.env.CLIENT_URL}`);
});
