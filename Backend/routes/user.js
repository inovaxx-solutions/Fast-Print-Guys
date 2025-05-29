const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model

const router = express.Router();

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from the Authorization header
  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token, forbidden
    req.user = user; // Attach user info to the request
    next(); // Proceed to the next middleware or route handler
  });
};

// Route to get the logged-in user's data
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    // console.log(user)
    if (!user) return res.sendStatus(404); // User not found
    res.json({ userName: user.userName, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.sendStatus(500); // Internal server error
  }
});

module.exports = router;
