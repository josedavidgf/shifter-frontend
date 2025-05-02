import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader/Loader';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../hooks/useToast';

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { setIsWorker, getToken } = useAuth();
  const { getMyWorkerProfile, completeOnboarding } = useWorkerApi();
  const { showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken();
        await completeOnboarding(token);

        const updatedWorker = await getMyWorkerProfile(token);
        setIsWorker(updatedWorker);

        if (updatedWorker?.onboarding_completed) {
          setTimeout(() => navigate('/calendar'), 800); // ⏱️ Transición suave
        } else {
          showError('Tu perfil no se ha actualizado correctamente.');
          setFailed(true);
        }
      } catch (err) {
        console.error('❌ Error completando onboarding:', err.message);
        showError('Algo salió mal al completar el onboarding.');
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    completeAndRedirect();
  }, [navigate, getToken, setIsWorker, completeOnboarding, getMyWorkerProfile, showError]);

  if (loading) return <Loader text="Finalizando onboarding..." />;

  if (failed) {
    return (
      <div className="page page-primary" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>❌ Error al finalizar el onboarding</h2>
        <p>Redirígete manualmente a tu panel.</p>
        <div className="mt-4">
          <Button
            label="Ir al panel"
            variant="primary"
            size="lg"
            onClick={() => navigate('/calendar')}
          />
        </div>
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
