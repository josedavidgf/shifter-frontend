import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    // Cargar el usuario desde el localStorage al iniciar la aplicación
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setCurrentUser({ token });
        }
    }, []);

    // Registro de usuario
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

    // Inicio de sesión
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

    // Cerrar sesión
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
