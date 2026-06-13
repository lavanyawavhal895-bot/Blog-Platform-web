import axios from 'axios';

// Create a central axios instance with your base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor to automatically add the token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;