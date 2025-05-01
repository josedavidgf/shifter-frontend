import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader/Loader';
import Button from '../components/ui/Button/Button'; // Ajusta ruta si necesario
import axios from 'axios';


const AuthCallback = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fallbackTimeout; // ✅ Declarado fuera

    async function handleCallback() {
      // ⏱️ Fallback de 10s máximo
      fallbackTimeout = setTimeout(() => {
        setLoading(false);
        if (!error) {
          setError('El proceso de verificación está tardando demasiado. Intenta iniciar sesión nuevamente.');
        }
      }, 8000);

      let session = null;

      const { data: maybeSession } = await supabase.auth.getSession();
      console.log('maybeSession:',maybeSession);
      if (maybeSession?.session) {
        console.log('🎯 Ya hay sesión activa');
        session = maybeSession.session;
        setCurrentUser(session.user);
      } else {
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
        }
      }

      if (!session) {
        setError('No se pudo recuperar tu sesión. Intenta iniciar sesión nuevamente.');
        setLoading(false);
        return;
      }


      try {
        console.log('🏋🏼‍♂️🏋🏼‍♂️🏋🏼‍♂️🏋🏼‍♂️CREAR WORKER')
        const token = session.access_token;
        console.log('🆕 Creando worker con token:', token);
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers/init`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });


        const result = await res.json();
        console.log('🧱 Resultado de /init:', result);
      } catch (err) {
        console.error('❌ Error creando el worker inicial:', err.message);
      } finally {
        setLoading(false);
      }

    }

    handleCallback();

    // ✅ cleanup correcto del timeout
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
