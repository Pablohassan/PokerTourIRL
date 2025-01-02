import axios from 'axios';
import config from './config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Remove withCredentials if you don't need cookies
  withCredentials: false,
  timeout: 10000
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error(`Server Connection Error - Is your backend running at ${config.API_BASE_URL}?`);
    }
    return Promise.reject(error);
  }
);

export default api;