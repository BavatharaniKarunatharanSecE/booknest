const express = require('express');
const router = express.Router();
const userBusiness = require('./users-business');
const { validateUser, validateLogin, validateOTP } = require('./middlewares/usersValidation');
const { authenticate, authorize } = require('../../shared/middlewares/auth');

// Public routes
router.post('/register', validateUser, async (req, res) => {
  try {
    const newUser = await userBusiness.registerUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await userBusiness.loginUser(email, password);
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        userId: result.userId,
        email: result.email
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/verify-otp', validateOTP, async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const result = await userBusiness.verifyOTP(userId, otp);
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    
    const result = await userBusiness.refreshAccessToken(refreshToken);
    
    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Protected routes
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await userBusiness.getUserById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/profile', authenticate, validateUser, async (req, res) => {
  try {
    const updatedUser = await userBusiness.updateUser(req.user.id, req.body, req.user);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Admin only routes
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const result = await userBusiness.getAllUsers(page, limit);
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await userBusiness.getUserById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

router.put('/:id', authenticate, authorize('admin'), validateUser, async (req, res) => {
  try {
    const updatedUser = await userBusiness.updateUser(req.params.id, req.body, req.user);
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const result = await userBusiness.deleteUser(req.params.id, req.user);
    
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;