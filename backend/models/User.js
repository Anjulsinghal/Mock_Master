const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  scores: [{ topic: String, score: Number }],
});

module.exports = mongoose.model('User', userSchema);
