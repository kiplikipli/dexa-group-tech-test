// lib/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // needed for httpOnly cookies like refresh token
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
