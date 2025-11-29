import React, { useState, useEffect } from 'react';

const BookForm = ({ book, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publicationYear: new Date().getFullYear(),
    averageRating: 0,
    numberOfPages: 0
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        publicationYear: book.publicationYear || new Date().getFullYear(),
        averageRating: book.averageRating || 0,
        numberOfPages: book.numberOfPages || 0
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }

    if (!formData.publicationYear || formData.publicationYear < 1000 || formData.publicationYear > new Date().getFullYear()) {
      newErrors.publicationYear = `Publication year must be between 1000 and ${new Date().getFullYear()}`;
    }

    if (formData.averageRating < 0 || formData.averageRating > 5) {
      newErrors.averageRating = 'Rating must be between 0 and 5';
    }

    if (!formData.numberOfPages || formData.numberOfPages < 1) {
      newErrors.numberOfPages = 'Number of pages must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="form-group">
        <label htmlFor="title">Book Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? 'error' : ''}
          placeholder="Enter book title"
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">Author *</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={errors.author ? 'error' : ''}
          placeholder="Enter author name"
        />
        {errors.author && <span className="error-message">{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="genre">Genre *</label>
        <select
          id="genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
          className={errors.genre ? 'error' : ''}
        >
          <option value="">Select Genre</option>
          <option value="Fiction">Fiction</option>
          <option value="Dystopian">Dystopian</option>
          <option value="Romance">Romance</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Mystery">Mystery</option>
        </select>
        {errors.genre && <span className="error-message">{errors.genre}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="publicationYear">Publication Year *</label>
          <input
            type="number"
            id="publicationYear"
            name="publicationYear"
            value={formData.publicationYear}
            onChange={handleChange}
            className={errors.publicationYear ? 'error' : ''}
            min="1000"
            max={new Date().getFullYear()}
          />
          {errors.publicationYear && <span className="error-message">{errors.publicationYear}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="averageRating">Average Rating (0-5)</label>
          <input
            type="number"
            id="averageRating"
            name="averageRating"
            value={formData.averageRating}
            onChange={handleChange}
            className={errors.averageRating ? 'error' : ''}
            min="0"
            max="5"
            step="0.1"
          />
          {errors.averageRating && <span className="error-message">{errors.averageRating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="numberOfPages">Number of Pages *</label>
          <input
            type="number"
            id="numberOfPages"
            name="numberOfPages"
            value={formData.numberOfPages}
            onChange={handleChange}
            className={errors.numberOfPages ? 'error' : ''}
            min="1"
          />
          {errors.numberOfPages && <span className="error-message">{errors.numberOfPages}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {book ? 'Update Book' : 'Add Book'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;