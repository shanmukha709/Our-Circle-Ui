// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://designation-service.onrender.com', // default for citizen-service
});

// Automatically attach JWT token from localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default instance;
