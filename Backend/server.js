// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const shippingRouter = require('./routes/shipping.js');
const authMiddleware = require('./middleware/authMiddleware');
// require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend's URL
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Use authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shipping', shippingRouter)

// Example protected route
app.get('/api/profile', authMiddleware, (req, res) => {
  if (req.userRole === 'admin') {
    return res.redirect('/admin'); // Redirect to admin page
  }
  res.json({ message: 'User profile', userId: req.userId });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});