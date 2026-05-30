import axios from 'axios';
import { logoutRef } from '../context/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8081',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Call the AuthContext logout so React state (token + user) is cleared
      // atomically alongside localStorage. Directly removing from localStorage
      // without going through the context leaves stale state until the next
      // page reload, briefly showing authenticated UI for expired/revoked tokens.
      logoutRef.fn ? logoutRef.fn() : localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
