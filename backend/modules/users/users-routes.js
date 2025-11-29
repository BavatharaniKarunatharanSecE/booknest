const express = require('express');
const router = express.Router();
const userBusiness = require('./users-business');
const { validateUser, validateLogin } = require('./middlewares/usersValidation');

// GET /users - Get all users
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await userBusiness.getAllUsers(page, limit);
    
    res.status(200).json({
      success: true,
      count: result.users.length,
      pagination: result.pagination,
      data: result.users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await userBusiness.getUserByID(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user',
      error: error.message
    });
  }
});

// POST /users/signup - Create new user
router.post('/signup', validateUser, async (req, res) => {
  try {
    const newUser = await userBusiness.createUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser
    });
  } catch (error) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while creating user',
      error: error.message
    });
  }
});

// POST /users/login - User login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await userBusiness.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: user
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /users/:id - Update user
router.put('/:id', validateUser, async (req, res) => {
  try {
    const updatedUser = await userBusiness.updateUser(req.params.id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating user',
      error: error.message
    });
  }
});

// DELETE /users/:id - Delete user
router.delete('/:id', async (req, res) => {
  try {
    const result = await userBusiness.deleteUser(req.params.id);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message.includes('User not found')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting user',
      error: error.message
    });
  }
});

module.exports = router;