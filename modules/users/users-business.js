const User = require('./users-model');

// GET all users
const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    
    const users = await User.find({})
      .select('-password -__v')
      .skip(skip)
      .limit(limit);
    
    const totalUsers = await User.countDocuments();
    
    return {
      users,
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

// GET user by ID
const getUserByID = async (id) => {
  try {
    const user = await User.findById(id).select('-password -__v');
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

// POST create new user (signup)
const createUser = async (userData) => {
  try {
    // Check if user with same email or username already exists
    const existingUser = await User.findOne({
      $or: [
        { email: userData.email },
        { username: userData.username }
      ]
    });
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }
    
    const user = new User(userData);
    const savedUser = await user.save();
    
    // Return user without password
    return savedUser.getProfile();
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

// PUT update user
const updateUser = async (id, userData) => {
  try {
    // Don't allow password updates through this method
    if (userData.password) {
      delete userData.password;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      userData,
      { new: true, runValidators: true }
    ).select('-password -__v');
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

// DELETE user
const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      throw new Error('User not found');
    }
    
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};

// POST login user
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    return user.getProfile();
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

module.exports = {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};