const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

var bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
dotenv.config();
app.use(
  cors({
    origin: '*',
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.get('/health', (req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  };

  res.status(200).send(data);
});

app.use('/users', authRoutes);
app.use('/tasks', taskRoutes);
app.get('/', (req, res) => {
  res.send('This is api for the Pro Manage app');
});

app.use((req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;
