import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader/Loader';
import Button from '../components/ui/Button/Button'; // Ajusta ruta si necesario
import axios from 'axios';


const AuthCallback = () => {
  const navigate = useNavigate();
  const { rehydrateUser, currentUser, setCurrentUser, setIsWorker } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fallbackTimeout;

    async function handleCallback() {
      // ⏱️ Fallback de 8s máximo
      fallbackTimeout = setTimeout(() => {
        setLoading(false);
        if (!error) {
          setError('El proceso de verificación está tardando demasiado. Intenta iniciar sesión nuevamente.');
        }
      }, 8000);

      let session = null;

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionData?.session) {
        session = sessionData.session;
      } else {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession();
          if (error) {
            console.warn('⚠️ exchangeCodeForSession lanzó error:', error.message);
          }
          session = data?.session;
          if (session) {
            await supabase.auth.setSession(session);
            setCurrentUser(session.user); // ✅ esto es crítico para que el contexto se actualice
          }
        } catch (err) {
          console.warn('⚠️ Excepción en exchangeCodeForSession:', err.message);
        }
      }

      if (!session) {
        setError('No se pudo recuperar tu sesión. Intenta iniciar sesión nuevamente.');
        setLoading(false);
        return;
      }

      try {
        const token = session.access_token;

        // 1. Crear worker si no existe
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/workers/init`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // 2. Rehidratar estado desde contexto
        await rehydrateUser();

        // 3. Comprobar si el worker ha completado el onboarding
        const profileRes = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/workers/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const isOnboardingCompleted = profileRes?.data?.onboarding_completed;

        setLoading(false);
        navigate(isOnboardingCompleted ? '/calendar' : '/onboarding/code');
      } catch (err) {
        console.error('❌ Error creando o cargando el perfil:', err.response?.data?.message || err.message);
        setError('No se pudo crear tu perfil. Intenta iniciar sesión nuevamente.');
        await supabase.auth.signOut();
        setLoading(false);
      }
    }

    handleCallback();
    return () => clearTimeout(fallbackTimeout);
  }, []);



  if (loading) return <Loader text="Verificando tu cuenta..." />;

  if (error) {
    return (
      <div className="page page-primary">
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>❌ Algo salió mal</h2>
          <p>{error}</p>
          <Button
            label="Volver a iniciar sesión"
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
          />

        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
