const mongoose = require('mongoose');

// Define Book Schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    maxlength: [255, 'Title cannot exceed 255 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [255, 'Author name cannot exceed 255 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true,
    maxlength: [100, 'Genre cannot exceed 100 characters']
  },
  publicationYear: {
    type: Number,
    required: [true, 'Publication year is required'],
    min: [1000, 'Publication year must be at least 1000'],
    max: [new Date().getFullYear(), 'Publication year cannot be in the future']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  numberOfPages: {
    type: Number,
    required: [true, 'Number of pages is required'],
    min: [1, 'Book must have at least 1 page']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Create indexes for better performance
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ averageRating: -1 });

// Create Mongoose Model
const Book = mongoose.model('Book', bookSchema);

// CRUD Operations
const getAllBooks = async (filters = {}, page = 1, limit = 10, sortBy = 'title') => {
  try {
    // Build query
    let query = {};
    
    // Text search
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { author: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Genre filter
    if (filters.genre) {
      query.genre = { $regex: filters.genre, $options: 'i' };
    }
    
    // Author filter
    if (filters.author) {
      query.author = { $regex: filters.author, $options: 'i' };
    }
    
    // Rating filter
    if (filters.minRating) {
      query.averageRating = { $gte: parseFloat(filters.minRating) };
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { averageRating: -1 };
        break;
      case 'year':
        sortOptions = { publicationYear: -1 };
        break;
      case 'pages':
        sortOptions = { numberOfPages: -1 };
        break;
      case 'author':
        sortOptions = { author: 1 };
        break;
      default:
        sortOptions = { title: 1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Execute query
    const books = await Book.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count
    const totalBooks = await Book.countDocuments(query);

    return {
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
        hasNext: (page * limit) < totalBooks,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Error fetching books: ${error.message}`);
  }
};

const getBookByID = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid book ID format');
    }
    
    const book = await Book.findById(id).select('-__v');
    return book;
  } catch (error) {
    throw new Error(`Error fetching book: ${error.message}`);
  }
};

const addNewBook = async (bookData) => {
  try {
    const book = new Book(bookData);
    const savedBook = await book.save();
    return savedBook;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Book with similar details already exists');
    }
    throw new Error(`Error creating book: ${error.message}`);
  }
};

const updateExistingBook = async (id, bookData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid book ID format');
    }
    
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      bookData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updatedBook) {
      throw new Error('Book not found');
    }
    
    return updatedBook;
  } catch (error) {
    throw new Error(`Error updating book: ${error.message}`);
  }
};

const deleteBook = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid book ID format');
    }
    
    const deletedBook = await Book.findByIdAndDelete(id);
    
    if (!deletedBook) {
      throw new Error('Book not found');
    }
    
    return { message: 'Book deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting book: ${error.message}`);
  }
};

module.exports = {
  getAllBooks,
  getBookByID,
  addNewBook,
  updateExistingBook,
  deleteBook,
  Book // Export the model for potential direct use
};