import axios from 'axios';
import { useAuthStore } from '../../features/auth/store/authStore';
import { navigateTo } from '../utils/navigation';

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
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      navigateTo('/login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
