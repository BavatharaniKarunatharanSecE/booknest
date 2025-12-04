const User = require('./users-model');
const { generateAccessToken, generateRefreshToken } = require('../../shared/utils/jwt');
const { sendOTPEmail } = require('../../shared/services/emailService');

const registerUser = async (userData) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Return user without password
    return user.getProfile();
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

const loginUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(user.email, otp);
    
    if (!emailSent) {
      throw new Error('Failed to send OTP email');
    }

    return {
      message: 'OTP sent to your email',
      userId: user._id,
      email: user.email
    };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

const verifyOTP = async (userId, otpCode) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify OTP
    const isOTPValid = user.verifyOTP(otpCode);
    
    if (!isOTPValid) {
      throw new Error('Invalid or expired OTP');
    }

    // Clear OTP after successful verification
    user.clearOTP();
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      success: true,
      message: 'OTP verified successfully',
      accessToken,
      refreshToken,
      user: user.getProfile()
    };
  } catch (error) {
    throw new Error(`OTP verification failed: ${error.message}`);
  }
};

const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password -otp -__v')
      .skip(skip)
      .limit(limit);
    
    const totalUsers = await User.countDocuments();
    
    return {
      users: users.map(user => user.getProfile()),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: (page * limit) < totalUsers,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id).select('-password -otp -__v');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.getProfile();
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const updateUser = async (id, userData, currentUser) => {
  try {
    // Users can only update their own profile unless they're admin
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new Error('You can only update your own profile');
    }

    // Don't allow role changes unless user is admin
    if (userData.role && currentUser.role !== 'admin') {
      delete userData.role;
    }

    // Don't allow password updates through this method
    if (userData.password) {
      delete userData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true }
    ).select('-password -otp -__v');
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser.getProfile();
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

const deleteUser = async (id, currentUser) => {
  try {
    // Users can only delete their own account unless they're admin
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new Error('You can only delete your own account');
    }

    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      throw new Error('User not found');
    }
    
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const jwt = require('jsonwebtoken');
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    
    return {
      accessToken: newAccessToken,
      user: user.getProfile()
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOTP,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshAccessToken
};