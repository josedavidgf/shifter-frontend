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
      let session = null;

      // Paso 1: intentar intercambio del código
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession();
        if (error) {
          console.warn('⚠️ exchangeCodeForSession lanzó error:', error.message);
        }

        session = data?.session;
        if (session) {
          await supabase.auth.setSession(session);
          setCurrentUser(session.user);
        }
      } catch (err) {
        console.warn('⚠️ Excepción en exchangeCodeForSession:', err.message);
        // No hacemos return todavía
      }

      // Paso 2: fallback → si no hay session aún, intentamos getSession()
      if (!session) {
        const { data: fallbackData } = await supabase.auth.getSession();
        if (fallbackData?.session) {
          session = fallbackData.session;
          setCurrentUser(session.user);
        }
      }

      // Paso 3: si no hay sesión → mostrar error
      if (!session) {
        setError('No se pudo recuperar tu sesión. Intenta iniciar sesión nuevamente.');
        setLoading(false);
        return;
      }

      // Paso 4: verificación de estado del worker
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/post-login-check`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await res.json();

        if (!result.success) {
          setError('No se pudo verificar tu estado. Intenta iniciar sesión.');
          setLoading(false);
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
          navigate('/calendar');
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
