// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // ─── Removed custom "orderId" field entirely ───

  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  subtotal: {
    type: Number,
    required: true
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  taxes: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['stripe_card', 'stripe_link', 'paypal'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  stripeSessionId: {
    type: String
  },
  paypalOrderId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// We rely on MongoDB’s automatic "_id" instead of a custom orderId
module.exports = mongoose.model('Order', orderSchema);
