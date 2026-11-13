import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser as loginApi, registerUser as registerApi, getMe as getMeApi } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                setUser(null);
                setToken(null);
                setLoading(false);
                return;
            }

            try {
                const res = await getMeApi();
                if (res?.success && res?.data?.user) {
                    setUser(res.data.user);
                    setToken(savedToken);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                } else {
                    logout();
                }
            } catch (err) {
                console.warn('Session verification failed or expired, prompting sign-in:', err?.message);
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const res = await loginApi(credentials);
        if (res?.success && res?.data?.token) {
            const { token: newToken, user: newUser } = res.data;
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            return res.data;
        }
        throw new Error(res?.message || 'Login failed');
    };

    const register = async (userData) => {
        const res = await registerApi(userData);
        if (res?.success && res?.data?.token) {
            const { token: newToken, user: newUser } = res.data;
            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            return res.data;
        }
        throw new Error(res?.message || 'Registration failed');
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token && !!user,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
