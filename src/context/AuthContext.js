import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { getMyWorkerProfile, } from '../services/workerService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Recuperar usuario al iniciar app
  useEffect(() => {
    async function rehydrateUser() {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        const token = data.session.access_token;
        setCurrentUser(data.session.user);

        try {
          const workerProfile = await getMyWorkerProfile(token);
          setIsWorker(workerProfile);
        } catch (err) {
          console.warn("Worker not found (expected on new signups)", err);
          setIsWorker(null); // no es worker aún
        }
      }

      setLoading(false);
    }

    rehydrateUser();
  }, []);






  // Registro
  const register = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error && !data?.user) {
        console.error('❌ Error en el registro:', error.message);
        return;
      }

      if (!data.session) {
        console.log('✅ Usuario registrado, email pendiente de verificación');
        navigate('/verify-email'); // o muestra mensaje si no tienes esa ruta
        return;
      }

      localStorage.setItem('token', data.session.access_token);
      setCurrentUser(data.user);
      return data;

    } catch (err) {
      throw new Error(err.message);
    }
  };

  // login
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const user = data.user;
      const token = data.session.access_token;
      localStorage.setItem('token', token);
      setCurrentUser(user);

      const workerProfile = await getMyWorkerProfile(token);
      setIsWorker(workerProfile);

      if (!workerProfile) {
        navigate('/onboarding/code');
      } else if (!workerProfile.onboarding_completed) {
        navigate('/onboarding/speciality');
      } else {
        navigate('/dashboard');
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

    // Borra TODO el sessionStorage
    sessionStorage.clear();

    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsWorker(false);
  };

  // Obtener token actual
  const getToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log('🧪 Token desde getToken:', data?.session?.access_token);
    if (error || !data?.session?.access_token) return null;
    return data.session.access_token;
  };

  const refreshWorkerProfile = async () => {
    try {
      const token = await getToken();
      const workerProfile = await getMyWorkerProfile(token);
      setIsWorker(workerProfile);
    } catch (err) {
      console.error('Error refreshing worker profile:', err.message);
    }
  };


  const value = {
    currentUser,
    register,
    login,
    logout,
    getToken,
    loginWithGoogle,
    isWorker, // 👈 nuevo export
    loading,
    setIsWorker,
    refreshWorkerProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
