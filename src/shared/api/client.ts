import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';
import { handleApiError, createApiError } from '../utils/errorHandler';

const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment ? '/api' : import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    const apiError = handleApiError(error);
    const transformedError = createApiError(apiError);
    return Promise.reject(transformedError);
  }
);

export default apiClient;
