const express = require('express');
const router = express.Router();
const usersModel = require('./users-model');
const { validateUser, validateFavoriteBook, handleValidationErrors } = require('./middlewares/usersValidation');

// GET /users - Get all users
router.get('/', (req, res) => {
  try {
    const users = usersModel.getAllUsers();
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.status(200).json({
      success: true,
      count: usersWithoutPasswords.length,
      data: usersWithoutPasswords
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', (req, res) => {
  try {
    const user = usersModel.getUserByID(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /users - Create new user
router.post('/', validateUser, handleValidationErrors, (req, res) => {
  try {
    const existingUserByUsername = usersModel.getUserByUsername(req.body.username);
    const existingUserByEmail = usersModel.getUserByEmail(req.body.email);
    
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username already exists'
      });
    }
    
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }
    
    const newUser = usersModel.addNewUser(req.body);
    
    if (!newUser) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create user'
      });
    }
    
    const { password, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /users/:id - Update user
router.put('/:id', validateUser, handleValidationErrors, (req, res) => {
  try {
    const updatedUser = usersModel.updateExistingUser(req.params.id, req.body);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /users/:id - Delete user
router.delete('/:id', (req, res) => {
  try {
    const deleted = usersModel.deleteUser(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /users/:userId/favorites/:bookId - Add book to favorites
router.post('/:userId/favorites/:bookId', validateFavoriteBook, handleValidationErrors, (req, res) => {
  try {
    const updatedUser = usersModel.addFavoriteBook(req.params.userId, req.params.bookId);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      success: true,
      message: 'Book added to favorites',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error adding favorite book:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /users/:userId/favorites/:bookId - Remove book from favorites
router.delete('/:userId/favorites/:bookId', validateFavoriteBook, handleValidationErrors, (req, res) => {
  try {
    const updatedUser = usersModel.removeFavoriteBook(req.params.userId, req.params.bookId);
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      success: true,
      message: 'Book removed from favorites',
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error removing favorite book:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;