import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import supabase from '../config/supabase';

function ConfirmSignupRedirect() {
  const navigate = useNavigate();
  const { setIsWorker, completeOnboarding } = useAuth();

  useEffect(() => {
    async function restoreSession() {
      const hash = window.location.hash.substring(1); // Quita el `#`
      const params = new URLSearchParams(hash);
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (!access_token || !refresh_token) {
        console.error('No tokens found en el hash URL');
        return navigate('/login');
      }

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });

      if (error) {
        console.error('Error al restaurar sesión:', error.message);
        return navigate('/login');
      }

      const user = data.session.user;
      const token = data.session.access_token;
      console.log('🔐 Sesión restaurada tras verificación:', user);

      // Verificar si es worker y tiene onboarding completo
      const resWorker = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const isWorker = (await resWorker.json()).exists;
      setIsWorker(isWorker);

      if (!isWorker) return navigate('/onboarding');

      const resCompletion = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/completion`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { hasHospital, hasSpeciality } = await resCompletion.json();

      if (hasHospital && hasSpeciality) {
        completeOnboarding();
        navigate('/dashboard');
      } else {
        navigate('/onboarding/step-2');
      }
    }

    restoreSession();
  }, []);

  return <p>Verificando tu cuenta, un momento...</p>;
}

export default ConfirmSignupRedirect;
