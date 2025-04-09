import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../config/supabase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recuperar usuario al iniciar app
    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                setCurrentUser(null);
            } else {
                setCurrentUser(data.user);
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    // Registro
    const register = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            localStorage.setItem('token', data.session.access_token);
            setCurrentUser(data.user);
            return data;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            localStorage.setItem('token', data.session.access_token);
            setCurrentUser(data.user);
            return data;
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Logout
    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('hasCompletedOnboarding');
        setCurrentUser(null);
    };

    // Obtener token actual
    const getToken = async () => {
        const { data, error } = await supabase.auth.getSession();
        console.log('🧪 Token desde getToken:', data?.session?.access_token);
        if (error || !data?.session?.access_token) return null;
        return data.session.access_token;
    };

    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() =>
        localStorage.getItem('hasCompletedOnboarding') === 'true'
      );
      
      const completeOnboarding = () => {
        localStorage.setItem('hasCompletedOnboarding', 'true');
        setHasCompletedOnboarding(true); // 👈 esto forzará el rerender
      };
      

    const value = {
        currentUser,
        register,
        login,
        logout,
        getToken,
        hasCompletedOnboarding,
        completeOnboarding,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
