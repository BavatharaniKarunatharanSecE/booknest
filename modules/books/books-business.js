const Book = require('./books-model');

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
    throw new Error(`Error creating book: ${error.message}`);
  }
};

const updateExistingBook = async (id, bookData) => {
  try {
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
  deleteBook
};