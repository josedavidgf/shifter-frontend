import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ConfirmSignupRedirect = () => {
  const navigate = useNavigate();
  const { supabase } = useAuth();

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substring(1)); // quitamos '#'

    const access_token = hashParams.get('access_token');
    const refresh_token = hashParams.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(() => {
          navigate('/dashboard'); // o `/onboarding` si quieres forzar onboarding aquí
        })
        .catch((err) => {
          console.error('Error al establecer la sesión desde el hash:', err.message);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [navigate, supabase]);

  return null;
};

export default ConfirmSignupRedirect;
