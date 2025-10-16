const fs = require('fs');
const path = require('path');

const booksFilePath = path.join(__dirname, '../../../data/books.json');

// Helper function to read books from file
const readBooksFromFile = () => {
  try {
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books file:', error);
    return [];
  }
};

// Helper function to write books to file
const writeBooksToFile = (books) => {
  try {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing books file:', error);
    return false;
  }
};

// Get all books
const getAllBooks = () => {
  return readBooksFromFile();
};

// Get book by ID
const getBookByID = (id) => {
  const books = readBooksFromFile();
  return books.find(book => book.id === parseInt(id));
};

// Add new book
const addNewBook = (bookData) => {
  const books = readBooksFromFile();
  
  // Generate new ID
  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
  
  const newBook = {
    id: newId,
    ...bookData
  };
  
  books.push(newBook);
  
  if (writeBooksToFile(books)) {
    return newBook;
  }
  return null;
};

// Update existing book
const updateExistingBook = (id, bookData) => {
  const books = readBooksFromFile();
  const bookIndex = books.findIndex(book => book.id === parseInt(id));
  
  if (bookIndex === -1) {
    return null;
  }
  
  // Preserve the ID
  const updatedBook = {
    id: parseInt(id),
    ...bookData
  };
  
  books[bookIndex] = updatedBook;
  
  if (writeBooksToFile(books)) {
    return updatedBook;
  }
  return null;
};

// Delete book
const deleteBook = (id) => {
  const books = readBooksFromFile();
  const bookIndex = books.findIndex(book => book.id === parseInt(id));
  
  if (bookIndex === -1) {
    return false;
  }
  
  books.splice(bookIndex, 1);
  
  return writeBooksToFile(books);
};

module.exports = {
  getAllBooks,
  getBookByID,
  addNewBook,
  updateExistingBook,
  deleteBook
};