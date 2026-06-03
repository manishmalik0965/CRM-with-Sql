import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@/lib/api';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.user);
            } catch (err) {
                localStorage.removeItem('accessToken');
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('mfa_verified');
        setUser(null);
    };

    return <AuthContext.Provider value={{ user, setUser, isLoading, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
