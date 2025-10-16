const path = require('path');
const { readDataFromFile, writeDataToFile, generateNewId } = require('../shared/utils/dataHelpers');

const booksFilePath = path.join(__dirname, '../../data/books.json');

// Get all books
const getAllBooks = () => {
  return readDataFromFile(booksFilePath);
};

// Get book by ID
const getBookByID = (id) => {
  const books = readDataFromFile(booksFilePath);
  return books.find(book => book.id === parseInt(id));
};

// Add new book
const addNewBook = (bookData) => {
  const books = readDataFromFile(booksFilePath);
  const newId = generateNewId(books);
  
  const newBook = {
    id: newId,
    ...bookData
  };
  
  books.push(newBook);
  
  if (writeDataToFile(booksFilePath, books)) {
    return newBook;
  }
  return null;
};

// Update existing book
const updateExistingBook = (id, bookData) => {
  const books = readDataFromFile(booksFilePath);
  const bookIndex = books.findIndex(book => book.id === parseInt(id));
  
  if (bookIndex === -1) {
    return null;
  }
  
  const updatedBook = {
    id: parseInt(id),
    ...bookData
  };
  
  books[bookIndex] = updatedBook;
  
  if (writeDataToFile(booksFilePath, books)) {
    return updatedBook;
  }
  return null;
};

// Delete book
const deleteBook = (id) => {
  const books = readDataFromFile(booksFilePath);
  const bookIndex = books.findIndex(book => book.id === parseInt(id));
  
  if (bookIndex === -1) {
    return false;
  }
  
  books.splice(bookIndex, 1);
  return writeDataToFile(booksFilePath, books);
};

module.exports = {
  getAllBooks,
  getBookByID,
  addNewBook,
  updateExistingBook,
  deleteBook
};