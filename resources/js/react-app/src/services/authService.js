import api from './api';

const authService = {
    async login(email, password) {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    async getProfile() {
        try {
            const response = await api.get('/api/auth/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default authService; 