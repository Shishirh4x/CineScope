import axios from 'axios';

const backendAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request (if available)
backendAPI.interceptors.request.use(
  (config) => {
    const stored = JSON.parse(localStorage.getItem('cs_user') || 'null');
    if (stored?.token) {
      config.headers.Authorization = `Bearer ${stored.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap .data from every response
backendAPI.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default backendAPI;
