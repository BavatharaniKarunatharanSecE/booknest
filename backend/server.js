require('dotenv').config();
const express = require('express');
const connectDB = require('./modules/shared/middlewares/connect-db');
const bookRoutes = require('./modules/books/books-routes');
const cors = require('cors'); 
const userRoutes = require('./modules/users/users-routes');


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS middleware - Allow React frontend to connect
app.use(cors());

app.use('/users', userRoutes);

// Application-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/books', bookRoutes);

// Health check route
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  
  res.status(200).json({
    success: true,
    message: 'BookNest API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BookNest API - Phase 4 with React Frontend',
    version: '1.0.0',
    endpoints: {
      books: '/books'
    }
  });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on port ${PORT}`);
  console.log(`📚 BookNest API: http://localhost:${PORT}`);
});

module.exports = app;