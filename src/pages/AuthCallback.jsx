// src/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      const { data, error } = await supabase.auth.exchangeCodeForSession();

      if (error || !data?.session) {
        console.error('❌ Error recuperando sesión desde URL:', error?.message);
        navigate('/login');
        return;
      }

      const session = data.session;

      // Establecer sesión local (por si acaso)
      await supabase.auth.setSession(session);
      setCurrentUser(session.user);

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/post-login-check`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await res.json();

        if (!result.success) {
          console.error('❌ Error en post-login-check:', result.message);
          navigate('/login');
          return;
        }

        const status = result.data;

        if (!status.exists) {
          // No hay worker → crear desde onboarding
          navigate('/onboarding/code');
        } else if (status.onboarding_completed) {
          navigate('/calendar');
        } else if (!status.hasWorkerType) {
          navigate('/onboarding/code');
        } else if (!status.hasSpeciality) {
          navigate('/onboarding/speciality');
        } else if (!status.hasName) {
          navigate('/onboarding/name');
        } else if (!status.hasPhone) {
          navigate('/onboarding/phone');
        } else {
          navigate('/calendar'); // fallback
        }

      } catch (err) {
        console.error('❌ Error general en AuthCallback:', err.message);
        navigate('/login');
      }
    }

    handleCallback();
  }, []);

  return (
    <div className="page page-primary">
      <div className="container" style={{ padding: '2rem' }}>
        <h2>Verificando tu cuenta...</h2>
        <p>Un momento por favor.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
