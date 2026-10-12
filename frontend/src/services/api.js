import axios from 'axios';

/**
 * Centralized Axios client for AcxiomCRM.
 * Default base URL points to the Spring Boot REST backend at http://localhost:8080/api
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for logging or future auth token attachment
api.interceptors.request.use(
  (config) => {
    // Phase 1: Ready for future JWT / auth headers
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent response data handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network or server error occurred.';
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
