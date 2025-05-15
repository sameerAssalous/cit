import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        return user;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/user');
        return response.data.data.user;
    },
};

export const userService = {
    list: async (page = 1) => {
        const response = await api.get(`/users?page=${page}`);
        return response.data.data;
    },

    get: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data.data.user;
    },

    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data.data.user;
    },

    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data.data.user;
    },

    delete: async (id) => {
        await api.delete(`/users/${id}`);
    },
};

export default api; 