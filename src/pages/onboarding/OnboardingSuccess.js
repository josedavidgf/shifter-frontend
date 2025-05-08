import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader/Loader';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../hooks/useToast';

export default function OnboardingSuccess() {
  const { setIsWorker, getToken } = useAuth();
  const { getMyWorkerProfile, completeOnboarding } = useWorkerApi();
  const { showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken();
        await completeOnboarding(token);
        const updatedWorker = await getMyWorkerProfile(token);
        setIsWorker(updatedWorker);

        if (updatedWorker?.onboarding_completed) {
          setShouldRedirect(true); // ← solo redirigimos cuando esté todo listo
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
  }, [getToken, setIsWorker, completeOnboarding, getMyWorkerProfile, showError]);

  if (loading || !shouldRedirect) {
    return <Loader text="Finalizando onboarding y cargando tu calendario..." />;
  }

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
            onClick={() => setShouldRedirect(true)}
          />
        </div>
      </div>
    );
  }

  return <Navigate to="/calendar" replace />;
}
