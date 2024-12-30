const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');

const router = express.Router();
const SECRET_KEY = 'secretKey';

// Signup with profile picture upload
router.post('/signup', upload.single('profilePicture'), async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const existingUser  = await User.findOne({ email });
      if (existingUser ) {
        return res.status(400).json({ error: 'Email already in use' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Cloudinary returns the uploaded file URL
      const profilePictureUrl = req.file ? req.file.path : '';
  
      const user = new User({
        name,
        email,
        password: hashedPassword,
        profilePicture: profilePictureUrl,
      });
  
      await user.save();
      res.json({ message: 'User registered successfully', user });
    } catch (err) {
      res.status(500).json({ error: 'User already exists or input error' });
    }
  });

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });

    // Send response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
    