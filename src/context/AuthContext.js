import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../config/supabase';
import { getMyWorkerProfile, } from '../services/workerService';
import { initAmplitude, identifyUser } from '../lib/amplitude';
import * as amplitude from '@amplitude/analytics-browser';
import { useFeatureFlagApi } from '../api/useFeatureFlagApi';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}


let isAmplitudeInitialized = false; // 🔥 flag global (fuera del AuthProvider)


export function AuthProvider({ children }) {
  const { getFeatureFlags } = useFeatureFlagApi();
  const [currentUser, setCurrentUser] = useState(null);
  const [isWorker, setIsWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState(null);

  const [featureFlags, setFeatureFlags] = useState({});


  const rehydrateUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        console.warn('No active session detected.');
        setCurrentUser(null);
        setIsWorker(false);
        return;
      }

      const { session } = data;

      if (!session.access_token || !session.user) {
        console.warn('Invalid session structure detected.');
        setCurrentUser(null);
        setIsWorker(false);
        return;
      }

      const token = session.access_token;
      setCurrentUser(session.user);

      if (!isAmplitudeInitialized) {
        initAmplitude();
        isAmplitudeInitialized = true;
      }

      try {
        const workerProfile = await getMyWorkerProfile(token);
        if (workerProfile) {
          setIsWorker(workerProfile);
          identifyUser(workerProfile);
        } else {
          setIsWorker(false);
        }
      } catch (err) {
        console.warn('⛔️ Error al obtener perfil del worker:', err.message);
        setIsWorker(false);
      }

    } catch (globalError) {
      console.error('Error during rehydrateUser:', globalError);
      setCurrentUser(null);
      setIsWorker(false);
    } finally {
      setLoading(false);
    }
  };

  // Recuperar usuario al iniciar app
  useEffect(() => {
    const run = async () => {
      await rehydrateUser();
    };
    run();
  }, []);


  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {

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


  useEffect(() => {
    const refreshFlagsInterval = setInterval(async () => {
      if (!currentUser || !isWorker) return;

      const token = await getToken();
      if (!token) return;

      try {
        const flags = await getFeatureFlags(token);
        setFeatureFlags(flags);
        console.debug('[FF] Flags refrescadas automáticamente:', flags);
      } catch (err) {
        console.warn('⚠️ No se pudieron refrescar las FF en background');
      }
    }, 60 * 1000); // cada 60 segundos

    return () => clearInterval(refreshFlagsInterval);
  }, [currentUser?.id, isWorker?.worker_id]);




  const register = async (email, password) => {
    const redirectTo = process.env.REACT_APP_REDIRECT_URL;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      if (error.status === 429 || error.message.toLowerCase().includes('rate')) {
        throw new Error('rate_limit_exceeded');
      }
      throw error;
    }

    return data; // Devuelve { user, session }
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
    return data;
  };


  const loginWithGoogle = async () => {
    try {
      const redirectTo = process.env.REACT_APP_REDIRECT_URL;
      if (!redirectTo) {
        throw new Error('redirectTo no está definido. Revisa tu .env');
      }
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
      setIsWorker(workerProfile);
      try {
        const flags = await getFeatureFlags(token);
        setFeatureFlags(flags);
        console.log('[AuthContext] Feature flags actualizados:', flags);
      } catch (err) {
        console.warn('⚠️ No se pudieron cargar los feature flags:', err.message);
      }
    } catch (err) {
      console.error('Error refreshing worker profile:', err.message);
    }

  };

  const authReady = !loading && (currentUser === null || (currentUser && isWorker !== null));






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
    setPendingEmail,
    rehydrateUser,
    featureFlags
  };

  return (
    <AuthContext.Provider value={value}>
      {!authReady ? null : children}
    </AuthContext.Provider>
  );


}
