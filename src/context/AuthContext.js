import React, { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    async function register(email, password) {
        try {
            const data = await registerUser(email, password);
            const accessToken = data.data.session.access_token;
    
            if (!accessToken) throw new Error('Token no encontrado');
    
            localStorage.setItem('token', accessToken);
            setCurrentUser({ token: accessToken });
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async function login(email, password) {
        try {
            const data = await loginUser(email, password);
            const accessToken = data.data.session.access_token;
    
            if (!accessToken) throw new Error('Token no encontrado');
    
            localStorage.setItem('token', accessToken);
            setCurrentUser({ token: accessToken });
            return data;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    function logout() {
        localStorage.removeItem('token');
        setCurrentUser(null);
    }

    const value = {
        currentUser,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
