const express = require('express');
const router = express.Router();
const bookModel = require('./books-model');
const { validateBook } = require('./middlewares/booksValidation');

// GET /books - Get all books with filtering, search, pagination
router.get('/', async (req, res) => {
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

    const result = await bookModel.getAllBooks(filters, page, limit, sortBy);
    
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
router.get('/:id', async (req, res) => {
  try {
    const book = await bookModel.getBookByID(req.params.id);
    
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
    if (error.message.includes('Invalid book ID format')) {
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
router.post('/', validateBook, async (req, res) => {
  try {
    const newBook = await bookModel.addNewBook(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating book',
      error: error.message
    });
  }
});

// PUT /books/:id - Update book
router.put('/:id', validateBook, async (req, res) => {
  try {
    const updatedBook = await bookModel.updateExistingBook(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    if (error.message.includes('Invalid book ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
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
router.delete('/:id', async (req, res) => {
  try {
    const result = await bookModel.deleteBook(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('Invalid book ID format')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }
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

module.exports = router;