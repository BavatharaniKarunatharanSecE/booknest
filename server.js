require('dotenv').config();
const express = require('express');
const connectDB = require('./modules/shared/middlewares/connect-db');

// Import routes
const bookRoutes = require('./modules/books/books-routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Application-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/books', bookRoutes);

// Root route - simple welcome message
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BookNest',
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
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 BookNest API: http://localhost:${PORT}`);
});

module.exports = app;