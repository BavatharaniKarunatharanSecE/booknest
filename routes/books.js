const express = require('express');
const router = express.Router();

// GET all books
router.get('/', (req, res) => {
  res.json({ message: 'Get all books (dummy response)' });
});

// GET a book by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get book with id ${req.params.id}` });
});

// POST a new book
router.post('/', (req, res) => {
  res.json({ message: 'Add a new book (dummy response)' });
});

// DELETE a book by ID
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete book with id ${req.params.id}` });
});

module.exports = router;
