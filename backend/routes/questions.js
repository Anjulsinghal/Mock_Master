const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
const Question = require('../models/Question');

const router = express.Router();

// Add questions
router.post('/add', async (req, res) => {
  const { topic, questions } = req.body;
  try {
    const newQuestions = new Question({ topic, questions });
    await newQuestions.save();
    res.json({ message: 'Questions added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error adding questions' });
  }
});

// Route to upload JSON and save to MongoDB
router.post('/bulk-add', async (req, res) => {
  try {
    const questionsArray = req.body; // Get questions array from request body

    // Validate if the body is an array
    if (!Array.isArray(questionsArray)) {
      return res.status(400).json({ error: 'Request body must be an array of questions' });
    }

    // Save all documents to MongoDB
    await Question.insertMany(questionsArray);

    res.json({ message: 'Questions added successfully in bulk' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding questions in bulk' });
  }
});

// Get questions by topic
router.get('/:topic', async (req, res) => {
  try {
    const topicQuestions = await Question.findOne({ topic: req.params.topic });
    if (!topicQuestions) {
      return res.status(404).json({ error: 'Questions not found for the topic' });
    }
    res.json(topicQuestions.questions);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching questions' });
  }
});

router.post('/submit', async (req, res) => {
  const { userId, topic, answers } = req.body;
  try {
    const topicQuestions = await Question.findOne({ topic });
    if (!topicQuestions) {
      return res.status(404).json({ error: 'Questions not found for the topic' });
    }

    // Map correct answers to their corresponding option indices
    const correctAnswers = topicQuestions.questions.map(
      (q) => String.fromCharCode(q.options.indexOf(q.correctAnswer) + 97) // Convert index to 'a', 'b', etc.
    );

    // Calculate the score
    const score = answers.filter((ans, idx) => ans === correctAnswers[idx]).length;

    // Update user's score
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingScore = user.scores.find((s) => s.topic === topic);
    if (existingScore) {
      existingScore.score = score;
    } else {
      user.scores.push({ topic, score });
    }
    await user.save();

    res.json({ message: 'Test submitted successfully', score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error submitting test' });
  }
});



module.exports = router;
