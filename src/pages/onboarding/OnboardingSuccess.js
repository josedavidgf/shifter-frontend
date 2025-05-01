import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader/Loader';

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { setIsWorker, getToken } = useAuth();
  const { getMyWorkerProfile, completeOnboarding } = useWorkerApi();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken();
        await completeOnboarding(token);

        const updatedWorker = await getMyWorkerProfile(token);
        setIsWorker(updatedWorker);

        if (updatedWorker?.onboarding_completed) {
          navigate('/calendar');
        } else {
          setError('Tu perfil no se ha actualizado correctamente.');
        }
      } catch (err) {
        console.error('❌ Error completando onboarding:', err.message);
        setError('Algo salió mal al completar el onboarding.');
      } finally {
        setLoading(false);
      }
    };

    completeAndRedirect();
  }, [navigate, getToken]);

  if (loading) return <Loader text="Finalizando onboarding..." />;

  if (error) {
    return (
      <div className="page page-primary" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/calendar')}>Ir al panel igualmente</button>
      </div>
    );
  }

  return (
    <div className="page page-primary" style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎉 Onboarding completado</h2>
      <p>Serás redirigido a tu panel de control en un momento.</p>
      <p>Si no ocurre automáticamente, haz clic <a href="/calendar">aquí</a>.</p>
    </div>
  );
}
