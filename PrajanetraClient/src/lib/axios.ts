import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const storage = localStorage.getItem('user-storage');
        if (storage) {
            const { state } = JSON.parse(storage);
            const token = state?.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // redirect if we're already logged in (have a token) and get 401
        const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
            error.config?.url?.includes('/auth/register');

        if (error.response?.status === 401 && !isAuthEndpoint) {
            // Token expired or invalid - clear storage and redirect to login
            localStorage.removeItem('user-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper function to set token
export const setAuthToken = (token: string | null) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
};
