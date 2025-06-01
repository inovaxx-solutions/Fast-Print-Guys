require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const shippingRouter = require('./routes/shipping.js');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shipping', shippingRouter);

// Unified Stripe Checkout endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  const { orderId, amount, paymentMethodType } = req.body;

  // Validate required parameters
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Valid amount is required.' });
  }

  try {
    // Determine payment methods based on selection
  const paymentMethods = paymentMethodType === 'stripe_link'
  ? ['card', 'link']
  : ['card'];
      // Credit Card only supports card payments

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: paymentMethods,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: orderId ? `Order #${orderId}` : 'Book Printing Order',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart`,
      metadata: {
        orderId: orderId || 'unknown',
        paymentType: paymentMethodType
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create payment session' 
    });
  }
});

// Protected admin/user route (unchanged)
app.get('/api/profile', authMiddleware, (req, res) => {
  if (req.userRole === 'admin') {
    return res.redirect('/admin');
  }
  res.json({ 
    message: 'User profile', 
    userId: req.userId,
    role: req.userRole
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configured for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
});