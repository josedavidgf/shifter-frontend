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
  const [pendingEmail, setPendingEmail] = useState(null);

  const navigate = useNavigate();



  // Recuperar usuario al iniciar app
  useEffect(() => {
    async function rehydrateUser() {
      try {
        const { data, error } = await supabase.auth.getSession();

        // 1. Error o sin sesión válida
        if (error || !data?.session) {
          console.warn('No active session detected.');
          setCurrentUser(null);
          setIsWorker(false);
          setLoading(false);
          return;
        }

        const { session } = data;

        // 2. Validar token de sesión
        if (!session.access_token || !session.user) {
          console.warn('Invalid session structure detected.');
          setCurrentUser(null);
          setIsWorker(false);
          setLoading(false);
          return;
        }

        const token = session.access_token;
        setCurrentUser(session.user);

        // 3. Inicializar Amplitude solo si no estaba
        if (!isAmplitudeInitialized) {
          initAmplitude();
          isAmplitudeInitialized = true;
        }

        // 4. Obtener perfil de Worker
        try {
          const workerProfile = await getMyWorkerProfile(token);

          if (workerProfile) {
            setIsWorker(workerProfile);
            identifyUser(workerProfile);
          } else {
            console.log('⛔️ Worker no encontrado aún. Probablemente está en onboarding.');
            setIsWorker(false);
          }
        } catch (err) {
          if (err.message.includes('multiple') || err.message.includes('no rows')) {
            console.log('⛔️ Worker no encontrado aún. Probablemente está en onboarding.');
            setIsWorker(false);
          } else {
            console.error('Worker profile fetch error:', err);
            setIsWorker(false);
          }
        }

      } catch (globalError) {
        console.error('Error during rehydrateUser:', globalError);
        setCurrentUser(null);
        setIsWorker(false);
      } finally {
        setLoading(false); // Siempre al final
      }
    }

    rehydrateUser();
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        setCurrentUser(session.user);

        try {
          const token = session.access_token;
          const workerProfile = await getMyWorkerProfile(token);
          setIsWorker(workerProfile || false);
        } catch (err) {
          setIsWorker(false);
        }
      }

      if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
        setIsWorker(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);






  const register = async (email, password) => {
    const redirectTo =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/auth/callback'
        : 'https://pre-app.apptanda.com/auth/callback';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      console.error('❌ Error en el registro:', error.message);
      throw error;
    }

    return data; // Devuelve siempre { user, session }
  };


  // login
  const login = async (email, password) => {

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    const user = data.user;
    const token = data.session.access_token;
    setCurrentUser(user);

    try {
      const workerProfile = await getMyWorkerProfile(token);
      setIsWorker(workerProfile);
    } catch (err) {
      console.warn("Worker not found yet, maybe onboarding.");
      setIsWorker(false);
    }

    navigate('/calendar');
    return data;
  };


  const loginWithGoogle = async () => {
    try {
      const redirectTo =
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/auth/callback'
          : 'https://pre-app.apptanda.com/auth/callback';

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error('Google login error:', err.message);
      throw err;
    }
  };



  // Logout
  const logout = async () => {
    await supabase.auth.signOut();

    // Después de signOut, también limpias manualmente el estado
    //localStorage.removeItem('token');
    setCurrentUser(null);
    setIsWorker(false);
    amplitude.reset();

    // Nueva línea extra para rehidratar supabase internamente
    await supabase.auth.getSession(); // <-- importante: forzamos actualizar la sesión en local

  };


  // Obtener token actual
  const getToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session?.access_token) return null;

    // Validación extra
    if (!data.session.user) return null;

    return data.session.access_token;
  };

  const refreshWorkerProfile = async () => {
    try {
      const token = await getToken();
      const workerProfile = await getMyWorkerProfile(token);
      console.log('Worker profile refreshed:', workerProfile);
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
    refreshWorkerProfile,
    pendingEmail,
    setPendingEmail
  };

  const isReady = !loading;


  return (
    <AuthContext.Provider value={value}>
      {isReady ? children : null}
    </AuthContext.Provider>
  );

}
