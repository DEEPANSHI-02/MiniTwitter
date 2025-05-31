const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const noteRoutes = require('./routes/noteRoutes');
require('dotenv').config();

connectDB();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', noteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Mini Twitter API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});