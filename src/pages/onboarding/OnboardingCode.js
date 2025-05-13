import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAccessCodeApi } from '../../api/useAccessCodeApi';
import { useHospitalApi } from '../../api/useHospitalApi';
import { useAuth } from '../../context/AuthContext';
import { useWorkerApi } from '../../api/useWorkerApi';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import AccessCodeInput from '../../components/ui/AccessCodeInput/AccessCodeInput';
import Loader from '../../components/ui/Loader/Loader';
import { useToast } from '../../hooks/useToast';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';
import useTrackPageView from '../../hooks/useTrackPageView';


export default function OnboardingCodeStep() {
  const [code, setCode] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const { getToken, loading, isWorker } = useAuth();
  const { validateAccessCode } = useAccessCodeApi();
  const { getHospitals } = useHospitalApi();
  const { getWorkerTypes } = useWorkerApi();
  const navigate = useNavigate();
  const { showError } = useToast();

  useTrackPageView('onboarding-code');


  // Loader inicial mientras carga auth
  if (loading) return <Loader text="Cargando paso de onboarding..." minTime={50} />;

  // Si ya hizo onboarding, lo mandamos al calendario
  if (isWorker?.onboarding_completed === true) {
    return <Navigate to="/calendar" />;
  }

  const handleValidateCode = async (e) => {
    trackEvent(EVENTS.ONBOARDING_CODE_SUBMITTED, { code });
    e.preventDefault();
    setLoadingForm(true);

    try {
      const response = await validateAccessCode(code);
      const { hospital_id, worker_type_id } = response;

      const token = await getToken();
      if (!token) throw new Error('Token no disponible');

      const hospitals = await getHospitals(token);
      const workerTypes = await getWorkerTypes(token);

      const hospital = hospitals.find(h => h.hospital_id === hospital_id);
      const workerType = workerTypes.find(w => w.worker_type_id === worker_type_id);

      const hospitalName = hospital?.name || '';
      const workerTypeName = workerType?.worker_type_name || '';

      trackEvent(EVENTS.ONBOARDING_CODE_SUCCESS, {
        code,
        hospitalId: hospital_id,
        workerTypeId: worker_type_id,
      });

      navigate('/onboarding/confirm', {
        state: {
          hospital_id,
          worker_type_id,
          hospitalName,
          workerTypeName,
          access_code: code
        }
      });
    } catch (err) {
      console.error('❌ Error validando código:', err.message);
      trackEvent(EVENTS.ONBOARDING_CODE_FAILED, {
        code,
        error: err.message,
      });
      showError('Código inválido o error al validar. Verifica e intenta de nuevo.');
    } finally {
      setLoadingForm(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  return (
    <>
      <HeaderSecondLevel
        showBackButton
        onBack={handleBack}
      />
      <div className="page page-primary">
        <div className="container">
          <h2>Bienvenido a la plataforma</h2>
          <p>Para completar tu registro, introduce el código de acceso proporcionado por tus compañeros.</p>
          <form onSubmit={handleValidateCode}>
            <div className="access-code__container">
              <AccessCodeInput
                code={code}
                setCode={setCode}
              />
            </div>

            <Button
              label="Validar código"
              variant="primary"
              size="lg"
              type="submit"
              disabled={!code || loadingForm}
              isLoading={loadingForm}
            />
            <p className="text-sm mt-4">
              ¿No te sabes tu código para entrar en Tanda? Ponte en <Link
                to='https://tally.so/r/3NOK0j'
                onClick={() => trackEvent(EVENTS.ONBOARDING_HELP_LINK_CLICKED)}
              >
                contacto con nosotros
              </Link>
              para ayudarte a gestionarlo.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
