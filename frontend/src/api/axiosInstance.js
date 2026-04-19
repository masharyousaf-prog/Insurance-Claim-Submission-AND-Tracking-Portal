import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/authSlice';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// NEW: Handle expired tokens gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;