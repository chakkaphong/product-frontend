import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9002',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Request Interceptor (e.g., add auth token)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token'); // optional
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Response Interceptor (e.g., global error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
