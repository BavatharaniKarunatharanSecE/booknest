import React, { useState, useEffect } from 'react';
import { bookAPI } from '../services/api';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';

const AllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const loadBooks = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError('');
      
      const allFilters = { ...filters, ...searchFilters };
      if (searchTerm) {
        allFilters.search = searchTerm;
      }
      
      const response = await bookAPI.getAllBooks(allFilters);
      
      if (response.data.success) {
        setBooks(response.data.data);
      } else {
        setError('Failed to load books');
      }
    } catch (err) {
      setError('Error loading books: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    loadBooks({ search: term });
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    loadBooks(newFilters);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await bookAPI.deleteBook(bookId);
      setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
    } catch (err) {
      setError('Error deleting book: ' + (err.response?.data?.message || err.message));
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
    loadBooks({});
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="all-books">
      <div className="page-header">
        <h1>All Books</h1>
        <p>Manage your book collection ({books.length} books)</p>
      </div>

      <SearchBar onSearch={handleSearch} onFilter={handleFilter} />

      {(filters.genre || filters.minRating || searchTerm) && (
        <div className="active-filters">
          <span>Active filters: </span>
          {searchTerm && <span className="filter-tag">Search: "{searchTerm}"</span>}
          {filters.genre && <span className="filter-tag">Genre: {filters.genre}</span>}
          {filters.minRating && <span className="filter-tag">Rating: {filters.minRating}+</span>}
          <button onClick={clearFilters} className="clear-filters">Clear All</button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {books.length === 0 ? (
        <div className="no-books">
          <h3>No books found</h3>
          <p>Try adjusting your search criteria or add some books to your collection.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map(book => (
            <BookCard key={book._id} book={book} onDelete={handleDeleteBook} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllBooks;