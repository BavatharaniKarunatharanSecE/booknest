import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await onDelete(book._id);
    }
  };

  return (
    <div className="book-card">
      <div className="book-header">
        <h3 className="book-title">{book.title}</h3>
        <span className="book-rating">⭐ {book.averageRating}</span>
      </div>
      <p className="book-author">by {book.author}</p>
      <div className="book-details">
        <span className="book-genre">{book.genre}</span>
        <span className="book-year">{book.publicationYear}</span>
        <span className="book-pages">{book.numberOfPages} pages</span>
      </div>
      <div className="book-actions">
        <Link to={`/edit-book/${book._id}`} className="btn btn-edit">
          Edit
        </Link>
        <button onClick={handleDelete} className="btn btn-delete">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BookCard;