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
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  // Recuperar usuario al iniciar app
  useEffect(() => {
    async function rehydrateUser() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const user = data.session.user;
        const token = data.session.access_token;
        setCurrentUser(user);

        const isWorker = await checkIfWorkerExists(token);
        setIsWorker(isWorker);

        const hasCompleted = await checkIfWorkerHasHospitalAndSpeciality(token);
        setHasCompletedOnboarding(hasCompleted);
      }

      setLoading(false); // 🔁 importante para PrivateRoute
    }

    rehydrateUser();
  }, []);




  // Registro
  const register = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.error('❌ Error en el registro:', error.message);
        return;
      }

      if (!data.session) {
        console.log('✅ Usuario registrado, email pendiente de verificación');
        navigate('/verify-email'); // o muestra mensaje si no tienes esa ruta
        return;
      }
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
      const token = data.session.access_token;
      localStorage.setItem('token', token);
      setCurrentUser(user);
      console.log('🔑 Token guardado en localStorage:', token);
      console.log('👤 Usuario guardado en localStorage:', user);

      const isWorker = await checkIfWorkerExists(token);
      setIsWorker(isWorker); // 👈 importante
      console.log('👷 El usuario es trabajador:', isWorker);
      if (!isWorker) {
        console.log('❌ El usuario no es trabajador');
        setHasCompletedOnboarding(false);
        return navigate('/onboarding');
      }
      const hasFullOnboarding = await checkIfWorkerHasHospitalAndSpeciality(token);
      setHasCompletedOnboarding(hasFullOnboarding);

      if (hasFullOnboarding) {
        console.log('✅ El trabajador ha completado el onboarding');
        navigate('/dashboard');
      } else {
        console.log('❌ El trabajador no ha completado el onboarding');
        navigate('/onboarding/step-2');
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
    setCurrentUser(null);
    setHasCompletedOnboarding(false);
    setIsWorker(false);
  };

  // Obtener token actual
  const getToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log('🧪 Token desde getToken:', data?.session?.access_token);
    if (error || !data?.session?.access_token) return null;
    return data.session.access_token;
  };

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState((false));

  const completeOnboarding = () => {
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
    isWorker, // 👈 nuevo export
    loading,
    setIsWorker
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
