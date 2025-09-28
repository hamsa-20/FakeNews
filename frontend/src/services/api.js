import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 60000, // Increased timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      throw new Error(error.response.data.detail || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      throw new Error('Request failed: ' + error.message);
    }
  }
);

// Updated analyzeNews function to handle both text and files
export const analyzeNews = async (data, selectedModels, isMultimodal = false) => {
  try {
    if (isMultimodal) {
      // Handle FormData for file uploads
      const response = await api.post('/predict-multimodal', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Handle regular text analysis
      const response = await api.post('/predict', {
        text: data,
        models: selectedModels || ['twitter', 'mediaeval', 'socialcontext']
      });
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

export const getHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;