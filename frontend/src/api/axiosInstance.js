import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE || 'https://api.themoviedb.org/3',
  timeout: 10000,
});

// Attach API key to every request
axiosInstance.interceptors.request.use(
  (config) => {
    config.params = {
      api_key: import.meta.env.VITE_TMDB_KEY,
      ...config.params,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap .data from every response
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('TMDB API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
