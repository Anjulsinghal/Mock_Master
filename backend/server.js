const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const dashboardRoutes = require('./routes/dashboard');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors("http://127.0.0.1:5500/"));

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://anjulsinghal123:gSMKvbSxADuGXeEc@cluster0.iihoayt.mongodb.net/mock', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/dashboard', dashboardRoutes);

const frontendPath = path.join(__dirname, '../frontend'); // Adjust path to frontend folder
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, './frontend/index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
