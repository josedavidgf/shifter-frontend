import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader/Loader';
import Button from '../components/ui/Button/Button'; // Ajusta ruta si necesario


const AuthCallback = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      setLoading(true);
      setError(null);

      let session = null;

      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession();
        if (error) {
          console.warn('⚠️ exchangeCodeForSession lanzó error:', error.message);
        }

        session = data?.session || (await supabase.auth.getSession())?.data?.session;

        if (!session) {
          setError('No se pudo recuperar tu sesión.');
          return;
        }

        await supabase.auth.setSession(session);
        setCurrentUser(session.user);
      } catch (err) {
        console.error('❌ Excepción en exchangeCodeForSession:', err.message);

        // 🔁 Intento de rescate: buscar sesión activa
        const { data } = await supabase.auth.getSession();
        session = data?.session;

        if (!session) {
          setError('Error inesperado al verificar tu cuenta. Intenta iniciar sesión de nuevo.');
          return;
        }

        setCurrentUser(session.user);
      }

      try {
        console.log('token:', session.access_token);
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/post-login-check`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await res.json();
        console.log('result:', result)
        if (!result.success) {
          console.error('❌ Error en post-login-check:', result.message);
          setError('No se pudo verificar tu estado. Intenta iniciar sesión nuevamente.');
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
          navigate('/calendar'); // fallback
        }
      } catch (err) {
        console.error('❌ Error en verificación post-login:', err.message);
        setError('Ha fallado la verificación del estado del usuario.');
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
          <Button
            label="Volver a iniciar sesión"
            variant="primary"
            size="lg"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate('/login');
            }} />

        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
