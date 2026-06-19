import axios from 'axios';

const api = axios.create({
    // In production, VITE_API_URL will be used (e.g. https://your-backend.onrender.com/api)
    // In local development, it defaults to localhost:3000
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;