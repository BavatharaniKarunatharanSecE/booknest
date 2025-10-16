const path = require('path');
const { readDataFromFile, writeDataToFile, generateNewId } = require('../shared/utils/dataHelpers');

const usersFilePath = path.join(__dirname, '../../data/users.json');

// Get all users
const getAllUsers = () => {
  return readDataFromFile(usersFilePath);
};

// Get user by ID
const getUserByID = (id) => {
  const users = readDataFromFile(usersFilePath);
  return users.find(user => user.id === parseInt(id));
};

// Get user by username
const getUserByUsername = (username) => {
  const users = readDataFromFile(usersFilePath);
  return users.find(user => user.username === username);
};

// Get user by email
const getUserByEmail = (email) => {
  const users = readDataFromFile(usersFilePath);
  return users.find(user => user.email === email);
};

// Add new user
const addNewUser = (userData) => {
  const users = readDataFromFile(usersFilePath);
  const newId = generateNewId(users);
  
  const newUser = {
    id: newId,
    joinedDate: new Date().toISOString().split('T')[0],
    ...userData
  };
  
  users.push(newUser);
  
  if (writeDataToFile(usersFilePath, users)) {
    return newUser;
  }
  return null;
};

// Update existing user
const updateExistingUser = (id, userData) => {
  const users = readDataFromFile(usersFilePath);
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return null;
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    id: parseInt(id),
    joinedDate: users[userIndex].joinedDate
  };
  
  users[userIndex] = updatedUser;
  
  if (writeDataToFile(usersFilePath, users)) {
    return updatedUser;
  }
  return null;
};

// Delete user
const deleteUser = (id) => {
  const users = readDataFromFile(usersFilePath);
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return false;
  }
  
  users.splice(userIndex, 1);
  return writeDataToFile(usersFilePath, users);
};

// Add book to user's favorites
const addFavoriteBook = (userId, bookId) => {
  const users = readDataFromFile(usersFilePath);
  const userIndex = users.findIndex(user => user.id === parseInt(userId));
  
  if (userIndex === -1) {
    return null;
  }
  
  const user = users[userIndex];
  const bookIdNum = parseInt(bookId);
  
  if (!user.favoriteBooks) {
    user.favoriteBooks = [];
  }
  
  if (!user.favoriteBooks.includes(bookIdNum)) {
    user.favoriteBooks.push(bookIdNum);
  }
  
  if (writeDataToFile(usersFilePath, users)) {
    return user;
  }
  return null;
};

// Remove book from user's favorites
const removeFavoriteBook = (userId, bookId) => {
  const users = readDataFromFile(usersFilePath);
  const userIndex = users.findIndex(user => user.id === parseInt(userId));
  
  if (userIndex === -1) {
    return null;
  }
  
  const user = users[userIndex];
  const bookIdNum = parseInt(bookId);
  
  if (user.favoriteBooks && user.favoriteBooks.includes(bookIdNum)) {
    user.favoriteBooks = user.favoriteBooks.filter(id => id !== bookIdNum);
  }
  
  if (writeDataToFile(usersFilePath, users)) {
    return user;
  }
  return null;
};

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUsername,
  getUserByEmail,
  addNewUser,
  updateExistingUser,
  deleteUser,
  addFavoriteBook,
  removeFavoriteBook
};