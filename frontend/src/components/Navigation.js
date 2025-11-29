import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📚 BookNest
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/books" className="nav-link">All Books</Link>
          </li>
          <li className="nav-item">
            <Link to="/add-book" className="nav-link">Add Book</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;