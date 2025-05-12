import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/ui/Loader/Loader';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../hooks/useToast';
import useTrackPageView from '../../hooks/useTrackPageView';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';


export default function OnboardingSuccess() {
  const { setIsWorker, getToken } = useAuth();
  const { getMyWorkerProfile, completeOnboarding } = useWorkerApi();
  const { showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useTrackPageView('onboarding-success');

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken();
        await completeOnboarding(token);
        const updatedWorker = await getMyWorkerProfile(token);
        setIsWorker(updatedWorker);

        if (updatedWorker?.onboarding_completed) {
          trackEvent(EVENTS.ONBOARDING_SUCCESS_CONFIRMED, {
            workerId: updatedWorker.worker_id,
          });
          setShouldRedirect(true); // ← solo redirigimos cuando esté todo listo
        } else {
          trackEvent(EVENTS.ONBOARDING_SUCCESS_FAILED, {
            reason: 'onboarding_completed flag not true',
          });
          showError('Tu perfil no se ha actualizado correctamente.');
          setFailed(true);
        }
      } catch (err) {
        console.error('❌ Error completando onboarding:', err.message);
        trackEvent(EVENTS.ONBOARDING_SUCCESS_FAILED, {
          reason: 'exception',
          error: err.message,
        });
        showError('Algo salió mal al completar el onboarding.');
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    completeAndRedirect();
  }, [getToken, setIsWorker, completeOnboarding, getMyWorkerProfile, showError]);

  if (loading || !shouldRedirect) {
    return <Loader text="Finalizando onboarding y cargando tu calendario..." minTime={50} />;
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
