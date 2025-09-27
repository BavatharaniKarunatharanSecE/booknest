const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Import routes
const bookRoutes = require('./routes/books');
app.use('/books', bookRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('📚 Welcome to BookNest API (Phase 1 Setup)');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
