const express = require('express');
const router = express.Router();
const bookBusiness = require('./books-business');
const { validateBook } = require('./middlewares/booksValidation');
const { authenticate, authorize, optionalAuth } = require('../../shared/middlewares/auth');

// GET /books - Get all books with filtering, search, pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      genre,
      author,
      minRating,
      page = 1,
      limit = 10,
      sortBy = 'title'
    } = req.query;

    const filters = {};
    if (search) filters.search = search;
    if (genre) filters.genre = genre;
    if (author) filters.author = author;
    if (minRating) filters.minRating = minRating;

    const result = await bookBusiness.getAllBooks(filters, page, limit, sortBy);
    
    res.status(200).json({
      success: true,
      count: result.books.length,
      pagination: result.pagination,
      data: result.books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching books',
      error: error.message
    });
  }
});

// GET /books/:id - Get book by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const book = await bookBusiness.getBookByID(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching book',
      error: error.message
    });
  }
});

// POST /books - Create new book
router.post('/', authenticate, validateBook, async (req, res) => {
  try {
    // Add user ID to book data
    const bookData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const newBook = await bookBusiness.addNewBook(bookData);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating book',
      error: error.message
    });
  }
});

// PUT /books/:id - Update book
router.put('/:id', authenticate, validateBook, async (req, res) => {
  try {
    // Users can only update their own books unless they're admin
    const book = await bookBusiness.getBookByID(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (req.user.role !== 'admin' && book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own books'
      });
    }
    
    const updatedBook = await bookBusiness.updateExistingBook(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    if (error.message.includes('Book not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating book',
      error: error.message
    });
  }
});

// DELETE /books/:id - Delete book
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Users can only delete their own books unless they're admin
    const book = await bookBusiness.getBookByID(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (req.user.role !== 'admin' && book.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own books'
      });
    }
    
    const result = await bookBusiness.deleteBook(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('Book not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting book',
      error: error.message
    });
  }
});

// Admin only route for statistics
router.get('/stats/admin', authenticate, authorize('admin'), async (req, res) => {
  try {
    // Implement admin-only statistics here
    res.status(200).json({
      success: true,
      message: 'Admin statistics',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;