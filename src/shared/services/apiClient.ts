// API client setup - to be implemented later
// This is a placeholder for future API integration
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - to be implemented
apiClient.interceptors.request.use(
  config => {
    // Add auth token, etc. later
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - to be implemented
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle errors globally later
    return Promise.reject(error);
  }
);

export default apiClient;
