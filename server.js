const express = require('express');
const booksRoutes = require('./modules/books/books-routes');
const usersRoutes = require('./modules/users/users-routes');
const notFound = require('./modules/shared/middlewares/notFound');
const errorHandler = require('./modules/shared/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Application-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Book Management System API is running!',
    endpoints: {
      books: '/books',
      users: '/users'
    }
  });
});

// 404 Not Found handler
app.use(notFound);

// Error-handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at:`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  http://localhost:${PORT}/books`);
  console.log(`  http://localhost:${PORT}/users`);
});

module.exports = app;
