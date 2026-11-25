import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as loginApi, registerUser as registerApi, getMe as getMeApi, logoutUser as logoutApi } from '../services/auth.service';
import { getAccessToken, setAccessToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMeApi();
                if (res?.success && res?.data?.user) {
                    setUser(res.data.user);
                    const currentToken = getAccessToken();
                    setToken(currentToken);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } else {
                    logout();
                }
            } catch (err) {
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
            setAccessToken(newToken);
            setToken(newToken);
            setUser(newUser);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return res.data;
        }
        throw new Error(res?.message || 'Login failed');
    };

    const register = async (userData) => {
        const res = await registerApi(userData);
        if (res?.success && res?.data?.token) {
            const { token: newToken, user: newUser } = res.data;
            setAccessToken(newToken);
            setToken(newToken);
            setUser(newUser);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return res.data;
        }
        throw new Error(res?.message || 'Registration failed');
    };

    const logout = useCallback(() => {
        logoutApi().catch(() => {});
        setAccessToken(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const completeOAuth = useCallback((access, oauthUser) => {
        setAccessToken(access);
        setToken(access);
        setUser(oauthUser);
    }, []);

    const updateUser = useCallback((updatedUser) => setUser(updatedUser), []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                isAuthenticated: !!token && !!user,
                login,
                register,
                completeOAuth,
                updateUser,
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
