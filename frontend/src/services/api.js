const API_BASE_URL = 'http://localhost:3000/api';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  if (config.body) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return { data };
  } catch (error) {
    throw error;
  }
};

export const bookAPI = {
  getAllBooks: (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return apiRequest(`/books?${params.toString()}`);
  },

  getBookById: (id) => {
    return apiRequest(`/books/${id}`);
  },

  createBook: (bookData) => {
    return apiRequest('/books', {
      method: 'POST',
      body: bookData
    });
  },

  updateBook: (id, bookData) => {
    return apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: bookData
    });
  },

  deleteBook: (id) => {
    return apiRequest(`/books/${id}`, {
      method: 'DELETE'
    });
  },
};
export const authAPI = {
  register: (userData) => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: userData
    });
  },

  login: (email, password) => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: { email, password }
    });
  },

  verifyOTP: (userId, otp) => {
    return apiRequest('/users/verify-otp', {
      method: 'POST',
      body: { userId, otp }
    });
  },

  getProfile: () => {
    return apiRequest('/users/profile');
  },

  refreshToken: (refreshToken) => {
    return apiRequest('/users/refresh-token', {
      method: 'POST',
      body: { refreshToken }
    });
  },

  logout: () => {
    return apiRequest('/users/logout', {
      method: 'POST'
    });
  }
};
export default {bookAPI, authAPI};