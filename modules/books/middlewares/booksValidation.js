const { body, validationResult } = require('express-validator');

const validateBook = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Author must be between 1 and 255 characters'),
  
  body('genre')
    .notEmpty()
    .withMessage('Genre is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Genre must be between 1 and 100 characters'),
  
  body('publicationYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`Publication year must be between 1000 and ${new Date().getFullYear()}`),
  
  body('averageRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Average rating must be between 0 and 5'),
  
  body('numberOfPages')
    .isInt({ min: 1 })
    .withMessage('Number of pages must be a positive integer'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateBook
};