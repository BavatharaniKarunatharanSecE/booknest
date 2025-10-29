const mongoose = require('mongoose');

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
  }
}, {
  timestamps: true
});

// Create indexes for better performance
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ averageRating: -1 });

module.exports = mongoose.model('Book', bookSchema);