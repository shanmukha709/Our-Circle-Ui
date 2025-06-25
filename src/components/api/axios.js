// src/components/api/axios.js

import axios from 'axios';

// 🔹 Base URLs for different services (no extra path, only domain/port)

export const CITIZEN_SERVICE_BASE_URL = process.env.REACT_APP_CITIZEN_SERVICE_BASE_URL;
export const DESINATION_SERVICE_BASE_URL = process.env.REACT_APP_DESINATION_SERVICE_BASE_URL;
export const AUTH_SERVICE_BASE_URL = process.env.REACT_APP_AUTH_SERVICE_BASE_URL;
export const CHAT_SERVICE_BASE_URL = process.env.REACT_APP_CHAT_SERVICE_BASE_URL;


const instance = axios.create({
 
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Automatically attach JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Export default axios instance (if needed globally)
export default instance;
