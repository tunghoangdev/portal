import axios from 'axios';
import { env } from './env';

/**
 * API Client Configuration
 * Automatically uses the correct API URL based on environment
 */

// Create axios instance with environment-specific config
export const apiClient = axios.create({
  baseURL: env.API_URL,
  timeout: env.isProd ? 10000 : 30000, // Shorter timeout in production
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests in development
    if (env.isDevelopment) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    if (env.isDevelopment) {
      console.error('❌ Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (env.isDevelopment) {
      console.log('📥 API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    // Enhanced error logging based on environment
    if (env.isDevelopment || env.isBeta) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle specific error codes
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem('auth-token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
