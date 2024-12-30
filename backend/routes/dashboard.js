const express = require('express');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// Get user dashboard
router.get('/user/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Save score
router.post('/score/:id', async (req, res) => {
  const { topic, score } = req.body;
  try {
    const user = await User.findById(req.params.id);
    user.scores.push({ topic, score });
    await user.save();
    res.json({ message: 'Score updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving score' });
  }
});

module.exports = router;
