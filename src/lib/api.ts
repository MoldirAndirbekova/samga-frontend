// lib/api.ts
import axios from "axios";

// Debug: Log the environment variable
console.log('API URL from env:', process.env.NEXT_PUBLIC_API_URL);

// Ensure we have the correct URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://samga-backend-production.up.railway.app';

console.log('Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  
  // Debug: Log the full request URL
  console.log('Making request to:', `${config.baseURL || ''}${config.url || ''}`);
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;