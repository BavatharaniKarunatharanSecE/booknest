import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api';
import BookForm from '../components/BookForm';

const AddBook = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (bookData) => {
    try {
      const response = await bookAPI.createBook(bookData);
      
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Book added successfully!'
        });
        
        setTimeout(() => {
          navigate('/books');
        }, 2000);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'Error adding book: ' + (err.response?.data?.message || err.message)
      });
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  return (
    <div className="add-book">
      <div className="page-header">
        <h1>Add New Book</h1>
        <p>Fill in the details to add a new book to your collection</p>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <BookForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default AddBook;