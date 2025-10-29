require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');

// Import routes
const bookRoutes = require('./modules/books/books-routes');
// const userRoutes = require('./modules/users/users-routes'); // Uncomment when ready

// Import middlewares
const errorHandler = require('./modules/shared/middlewares/errorHandler');
const notFound = require('./modules/shared/middlewares/notFound');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/books', bookRoutes);
// app.use('/users', userRoutes); // Uncomment when ready

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BookNest API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BookNest API',
    version: '1.0.0',
    endpoints: {
      books: '/books',
      health: '/health'
    }
  });
});

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 BookNest API: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});