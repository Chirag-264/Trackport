import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_URL = baseURL;
let accessToken = null;
let refreshRequest = null;

export function setAccessToken(token) {
    accessToken = token || null;
}

export function getAccessToken() {
    return accessToken;
}

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor: Automatically attach JWT token if available
api.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Extract response data and handle common errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // If 401 Unauthorized occurs on a protected route, token is invalid/expired
        const originalRequest = error.config;
        const requestUrl = originalRequest?.url || '';
        const isAuthEntry = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'].some((path) => requestUrl.includes(path));
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEntry) {
            originalRequest._retry = true;
            try {
                refreshRequest ||= axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
                .then((response) => response.data.data.token)
                    .finally(() => { refreshRequest = null; });
                accessToken = await refreshRequest;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                accessToken = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (!window.location.pathname.startsWith('/auth')) {
                    window.location.replace('/auth/login');
                }
                return Promise.reject(refreshError);
            }
        }
        if (error.response?.status === 401 && !isAuthEntry) {
            accessToken = null;
            const currentPath = window.location.pathname;
            if (!currentPath.startsWith('/auth')) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.replace('/auth/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
