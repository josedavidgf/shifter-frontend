import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../config/supabase';
import { checkIfWorkerExists, checkIfWorkerHasHospitalAndSpeciality } from '../services/userService';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    

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
      
          const user = data.user;
          localStorage.setItem('token', data.session.access_token);
          setCurrentUser(user);
      
          console.log('🧑 ID del usuario logueado:', user.id);
      
          const isWorker = await checkIfWorkerExists(user.id);
      
          if (isWorker) {
            const hasFullOnboarding = await checkIfWorkerHasHospitalAndSpeciality(user.id);
      
            if (hasFullOnboarding) {
              localStorage.setItem('hasCompletedOnboarding', 'true');
              setHasCompletedOnboarding(true);
              navigate('/dashboard');
            } else {
              localStorage.removeItem('hasCompletedOnboarding');
              setHasCompletedOnboarding(false);
              navigate('/onboarding/step-2');
            }
      
          } else {
            localStorage.removeItem('hasCompletedOnboarding');
            setHasCompletedOnboarding(false);
            navigate('/onboarding');
          }
      
          return data;
        } catch (err) {
          throw new Error(err.message);
        }
    };
    const loginWithGoogle = async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
          });
          if (error) throw error;
          // El usuario será redirigido automáticamente
        } catch (err) {
          console.error('Google login error:', err.message);
          throw err;
        }
      };
      

    // Logout
    const logout = async () => {
        await supabase.auth.signOut();
        localStorage.removeItem('token');
        localStorage.removeItem('hasCompletedOnboarding');
        setCurrentUser(null);
        setHasCompletedOnboarding(false);
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
        loginWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
