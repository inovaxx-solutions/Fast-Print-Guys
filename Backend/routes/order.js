// routes/order.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware'); // to protect admin routes

// PayPal client factory (unchanged)
function createPayPalClient() {
  const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
  return new paypal.core.PayPalHttpClient(environment);
}

/**
 * 1) POST /api/order/create-order
 *    - Creates a new Order document in MongoDB with status "pending".
 *    - Expects in body:
 *         { items, subtotal, discountAmount, shippingCost, taxes, total, paymentMethod }
 *    - Returns the saved order (including its Mongo "_id").
 */
router.post('/create-order', async (req, res) => {
  const {
    items,
    subtotal,
    discountAmount = 0,
    shippingCost = 0,
    taxes = 0,
    total,
    paymentMethod
  } = req.body;

  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    typeof subtotal !== 'number' ||
    typeof total !== 'number' ||
    !['stripe_card', 'stripe_link', 'paypal'].includes(paymentMethod)
  ) {
    return res.status(400).json({ error: 'Invalid payload for create-order.' });
  }

  try {
    const newOrder = new Order({
      items,
      subtotal,
      discountAmount,
      shippingCost,
      taxes,
      total,
      paymentMethod,
      paymentStatus: 'pending'   // ← make sure this is "pending"
    });
    await newOrder.save();

    return res.json({ success: true, order: newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    return res.status(500).json({ error: 'Could not create order.' });
  }
});

/**
 * 2) POST /api/order/stripe-complete
 *    - Called client‐side after Stripe redirects back (passing { sessionId }).
 *    - Retrieves the Checkout Session, checks if payment_status==="paid",
 *      then updates that Order (found by _id) to paymentStatus="paid".
 */
router.post('/stripe-complete', async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const mongoOrderId = session.metadata.orderId; // this is the Mongo _id

    if (!mongoOrderId) {
      return res.status(400).json({ error: 'No orderId in session metadata.' });
    }

    // Find the order by Mongo _id
    const order = await Order.findById(mongoOrderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found in DB.' });
    }

    // If payment succeeded, update status & store stripeSessionId
    if (session.payment_status === 'paid') {
      order.paymentStatus = 'paid';
      order.stripeSessionId = sessionId;
      await order.save();
    }

    return res.json({ success: true, order });
  } catch (err) {
    console.error('Error in /stripe-complete:', err);
    return res.status(500).json({ error: 'Stripe completion failed.' });
  }
});

/**
 * 3) GET /api/order/paypal-capture?orderId={mongo _id}&token={paypalToken}
 *    - PayPal redirects to your return_url as:
 *        /checkout/confirmation?token=PAYID-XYZ&orderId=<_id>
 *    - Captures the payment, then updates that Order’s paymentStatus to "paid".
 */
router.get('/paypal-capture', async (req, res) => {
  const { orderId, token } = req.query; // orderId is actually the Mongo _id
  if (!orderId || !token) {
    return res.status(400).json({ error: 'Missing orderId or token in query.' });
  }

  try {
    // 1) Capture the PayPal order (token is the PayPal order ID)
    const request = new paypal.orders.OrdersCaptureRequest(token);
    request.requestBody({});
    const client = createPayPalClient();
    const captureResponse = await client.execute(request);

    // 2) Find our MongoDB order by _id
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found in DB.' });
    }

    // 3) If captureResponse indicates "COMPLETED", update our order
    if (captureResponse.result.status === 'COMPLETED') {
      order.paymentStatus = 'paid';
      order.paypalOrderId = token;
      await order.save();

      // Redirect user back to front-end confirmation
      return res.redirect(
        `http://localhost:5173/checkout/confirmation?paypal=true&orderId=${orderId}`
      );
    } else {
      return res.status(400).json({ error: 'PayPal capture not completed.' });
    }
  } catch (err) {
    console.error('PayPal capture error:', err);
    return res.status(500).json({ error: 'PayPal capture failed.' });
  }
});

/**
 * 4) GET /api/order/all
 *    - Admin endpoint to fetch all orders (requires authMiddleware).
 */
router.get('/all', authMiddleware, async (req, res) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log(orders);
    return res.json({ orders });
  } catch (err) {
    console.error('Error fetching all orders:', err);
    return res.status(500).json({ error: 'Could not fetch orders.' });
  }
});

module.exports = router;
