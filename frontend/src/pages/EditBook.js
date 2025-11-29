import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bookAPI } from '../services/api';
import BookForm from '../components/BookForm';

const EditBook = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadBook();
  }, [id]);

  const loadBook = async () => {
    try {
      const response = await bookAPI.getBookById(id);
      if (response.data.success) {
        setBook(response.data.data);
      } else {
        setError('Book not found');
      }
    } catch (err) {
      setError('Error loading book: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (bookData) => {
    try {
      const response = await bookAPI.updateBook(id, bookData);
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Book updated successfully!'
        });
        
        setTimeout(() => {
          navigate('/books');
        }, 2000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Error updating book: ' + (err.response?.data?.message || err.message)
      });
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  if (loading) {
    return <div className="loading">Loading book...</div>;
  }

  if (error) {
    return (
      <div className="add-book">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/books')} className="btn btn-primary">
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="edit-book">
      <div className="page-header">
        <h1>Edit Book</h1>
        <p>Update the book details</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <BookForm book={book} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default EditBook;