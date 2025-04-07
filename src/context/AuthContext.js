import React, { useContext, useState, useEffect, createContext } from 'react';
import supabase from '../config/supabase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar el estado de autenticación al cargar la aplicación
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                setCurrentUser(data.session?.user || null);
            } catch (error) {
                console.error('Error fetching session:', error.message);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    // Cerrar sesión
    const logout = async () => {
        try {
            await supabase.auth.signOut();
            setCurrentUser(null);
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    const value = {
        currentUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
