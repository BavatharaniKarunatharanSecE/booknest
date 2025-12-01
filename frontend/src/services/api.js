const API_BASE_URL = 'http://localhost:3001';

// Helper function for API calls
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

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

export default bookAPI;