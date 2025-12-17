// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext } from 'react';

type AuthContextType = {
    token: string | null;
    user: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<string | null>(localStorage.getItem('user'));

    const login = (newToken: string, email: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', email);
        setToken(newToken);
        setUser(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};