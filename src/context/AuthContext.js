import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { getMyWorkerProfile, } from '../services/workerService';
import { initAmplitude, identifyUser } from '../lib/amplitude';
import * as amplitude from '@amplitude/analytics-browser';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}


let isAmplitudeInitialized = false; // 🔥 flag global (fuera del AuthProvider)


export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  // Recuperar usuario al iniciar app
  useEffect(() => {
    async function rehydrateUser() {
      const { data } = await supabase.auth.getSession();

      if (!data?.session) {
        setLoading(false);
        return;
      }

      const token = data.session.access_token;
      setCurrentUser(data.session.user);

      if (!isAmplitudeInitialized) {
        initAmplitude();
        isAmplitudeInitialized = true;
      }

      try {
        const workerProfile = await getMyWorkerProfile(token);
        if (!workerProfile) {
          setIsWorker(false);
        } else {
          setIsWorker(workerProfile);
          identifyUser(workerProfile);
        }
      } catch (err) {
        console.warn('Worker not found', err);
        setIsWorker(null);
      } finally {
        setLoading(false); // ✅ SIEMPRE al final
      }
    }

    rehydrateUser(); // 👈🏻 Este llamado está bien, **dentro del useEffect** pero **fuera** de async function
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

      navigate('/calendar'); // ⬅️ o cualquier ruta protegida


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
    setCurrentUser(null);
    setIsWorker(false);
    amplitude.reset()
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

  const authReady = !loading && (currentUser === null || (currentUser && (isWorker || isWorker === false)));



  const value = {
    currentUser,
    register,
    login,
    logout,
    getToken,
    loginWithGoogle,
    isWorker,
    loading,
    authReady, 
    setIsWorker,
    refreshWorkerProfile
  };

  const isReady =
    !loading &&
    (currentUser === null || (currentUser && isWorker !== false && isWorker !== null));

  return (
    <AuthContext.Provider value={value}>
      {isReady ? children : null}
    </AuthContext.Provider>
  );

}
