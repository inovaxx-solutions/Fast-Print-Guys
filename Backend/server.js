require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const shippingRouter = require('./routes/shipping');
const orderRoutes = require('./routes/order');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// 2. MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// 3. Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shipping', shippingRouter);
app.use('/api/order', orderRoutes);

// 4. Stripe: Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
  const { orderId, amount, paymentMethodType } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount is required.' });
  }

  try {
    const paymentMethods = paymentMethodType === 'stripe_link'
      ? ['card', 'link']
      : ['card'];

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
        paymentType: paymentMethodType
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Stripe Checkout error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment session' });
  }
});

// 5. Stripe: Retrieve Session Details
app.get('/api/checkout-session-details', async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'Missing session ID' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json(session);
  } catch (error) {
    console.error('❌ Stripe session fetch failed:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. PayPal: Create Order
function createPayPalClient() {
  const environment = new paypal.core.SandboxEnvironment( // Change to LiveEnvironment for production
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  return new paypal.core.PayPalHttpClient(environment);
}

app.post('/api/create-paypal-order', async (req, res) => {
  const { amount, orderId } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required' });

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
      return_url: `${process.env.CLIENT_URL}/checkout/confirmation?paypal=true&orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`
    }
  });

  try {
    const client = createPayPalClient();
    const response = await client.execute(request);
    const approveUrl = response.result.links.find(link => link.rel === 'approve')?.href;
    if (!approveUrl) throw new Error('No approval link from PayPal');
    res.json({ approveUrl });
  } catch (err) {
    console.error('❌ PayPal Order Error:', err.message);
    res.status(500).json({ error: 'PayPal order creation failed.' });
  }
});

// 7. PayPal: Capture Order
app.get('/api/capture-paypal-order', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing PayPal token' });

  const client = createPayPalClient();
  const request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});

  try {
    const capture = await client.execute(request);
    console.log('✅ PayPal capture result:', JSON.stringify(capture.result, null, 2));
    res.json({
      orderId: capture.result.id,
      status: capture.result.status,
      payer: capture.result.payer,
      amount: capture.result.purchase_units[0].payments.captures[0].amount
    });
  } catch (err) {
    console.error('❌ PayPal Capture Error:', err.message);
    if (err.response) {
      console.error('🔍 PayPal response:', JSON.stringify(err.response, null, 2));
    }
    res.status(500).json({ error: 'PayPal capture failed.' });
  }
});

// 8. Protected Test Route
app.get('/api/profile', authMiddleware, (req, res) => {
  if (req.userRole === 'admin') return res.redirect('/admin');
  res.json({
    message: 'User profile',
    userId: req.userId,
    role: req.userRole
  });
});

// 9. Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 10. Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Client: ${process.env.CLIENT_URL}`);
});
