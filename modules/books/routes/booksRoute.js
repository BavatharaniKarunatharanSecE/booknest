const express = require('express');
const router = express.Router();
const booksModel = require('../models/booksModel');
const { validateBook, handleValidationErrors } = require('../middlewares/booksValidation');

// GET /books - Get all books
router.get('/', (req, res) => {
  try {
    const books = booksModel.getAllBooks();
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /books/:id - Get book by ID
router.get('/:id', (req, res) => {
  try {
    const book = booksModel.getBookByID(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /books - Create new book
router.post('/', validateBook, handleValidationErrors, (req, res) => {
  try {
    const newBook = booksModel.addNewBook(req.body);
    
    if (!newBook) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create book'
      });
    }
    
    res.status(201).json({
      success: true,
      data: newBook
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /books/:id - Update book
router.put('/:id', validateBook, handleValidationErrors, (req, res) => {
  try {
    const updatedBook = booksModel.updateExistingBook(req.params.id, req.body);
    
    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /books/:id - Delete book
router.delete('/:id', (req, res) => {
  try {
    const deleted = booksModel.deleteBook(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;