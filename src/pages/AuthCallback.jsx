import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader/Loader';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession();

        if (error || !data?.session) {
          console.error('❌ Error recuperando sesión desde URL:', error?.message);
          setError('No se pudo recuperar la sesión. Intenta iniciar sesión de nuevo.');
          return;
        }

        const session = data.session;
        await supabase.auth.setSession(session);
        setCurrentUser(session.user);

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/post-login-check`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        const result = await res.json();
        if (!result.success) {
          console.error('❌ Error en post-login-check:', result.message);
          setError('No se pudo verificar el estado del usuario. Intenta iniciar sesión.');
          return;
        }

        const status = result.data;

        if (!status.exists) {
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
          navigate('/calendar'); // fallback final
        }
      } catch (err) {
        console.error('❌ Error general en AuthCallback:', err.message);
        setError('Ha ocurrido un error inesperado. Por favor, vuelve a intentarlo.');
      } finally {
        setLoading(false);
      }
    }

    handleCallback();
  }, []);

  if (loading) {
    return <Loader text="Verificando tu cuenta..." />;
  }

  if (error) {
    return (
      <div className="page page-primary">
        <div className="container" style={{ padding: '2rem' }}>
          <h2>❌ Algo salió mal</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/login')} style={{ marginTop: '1rem' }}>
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
