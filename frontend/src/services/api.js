import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor: Automatically attach JWT token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Extract response data and handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 401 Unauthorized occurs on a protected route, token is invalid/expired
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/auth')) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;