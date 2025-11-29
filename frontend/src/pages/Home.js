import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to BookNest 📚</h1>
        <p>Your personal library management system</p>
        <div className="hero-actions">
          <Link to="/books" className="btn btn-primary">Browse Books</Link>
          <Link to="/add-book" className="btn btn-secondary">Add New Book</Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>📖 Manage Collection</h3>
          <p>Add, edit, and organize your book collection with ease</p>
        </div>
        <div className="feature-card">
          <h3>🔍 Smart Search</h3>
          <p>Find books quickly with advanced search and filtering</p>
        </div>
        <div className="feature-card">
          <h3>📊 Track Details</h3>
          <p>Keep track of ratings, genres, and publication years</p>
        </div>
      </div>
    </div>
  );
};

export default Home;