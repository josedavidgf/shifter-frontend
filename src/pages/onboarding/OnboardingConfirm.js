import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import Checkbox from '../../components/ui/Checkbox/Checkbox';
import { useToast } from '../../hooks/useToast';
import supabase from '../../config/supabase';
import { translateWorkerType } from '../../utils/translateServices';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';
import useTrackPageView from '../../hooks/useTrackPageView';

export default function OnboardingConfirmStep() {
  const [hospitalId, setHospitalId] = useState('');
  const [workerTypeId, setWorkerTypeId] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const { getToken, setIsWorker, refreshWorkerProfile } = useAuth();
  const { createWorker, createWorkerHospital } = useWorkerApi();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const location = useLocation();
  const { hospital_id, worker_type_id, hospitalName, workerTypeName } = location.state || {};

  const termsUrl = '/legal/terms-v1.pdf';
  const privacyUrl = '/legal/privacy-v1.pdf';

  const getVersionFromUrl = (url) => {
    const match = url.match(/-(v\d+)\.pdf$/);
    return match ? match[1] : 'v1';
  };

  useTrackPageView('onboarding-confirm');

  useEffect(() => {
    if (!hospital_id || !worker_type_id) {
      navigate('/onboarding/code');
    } else {
      setHospitalId(hospital_id);
      setWorkerTypeId(worker_type_id);
    }
  }, [hospital_id, worker_type_id, navigate]);

  const handleConfirm = async () => {
    trackEvent(EVENTS.ONBOARDING_CONFIRM_SUBMITTED, {
      hospitalId,
      workerTypeId,
      acceptedTerms,
      acceptedPrivacy,
    });
    setLoadingForm(true);
    try {
      const token = await getToken();

      const response = await createWorker({ workerTypeId }, token);
      if (!response?.success) {
        throw new Error(response?.message || 'Error al crear el trabajador');
      }

      await createWorkerHospital(response.worker.worker_id, hospitalId, token);

      // Guardar aceptación legal
      await supabase.from('legal_acceptance').insert({
        worker_id: response.worker.worker_id,
        terms_version: getVersionFromUrl(termsUrl),
        privacy_version: getVersionFromUrl(privacyUrl),
        user_agent: navigator.userAgent
      });

      await refreshWorkerProfile();
      trackEvent(EVENTS.ONBOARDING_CONFIRM_SUCCESS, {
        hospitalId,
        workerTypeId,
      });
      showSuccess('Trabajador creado con éxito');
      navigate('/onboarding/speciality');
    } catch (err) {
      console.error('❌ Error creando el worker o guardando consentimiento:', err.message);
      trackEvent(EVENTS.ONBOARDING_CONFIRM_FAILED, {
        error: err.message,
        hospitalId,
        workerTypeId,
      });
      showError('Error creando el perfil. Por favor inténtalo de nuevo.');
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
          <h2 className="register-code__title">
            El código que has introducido te habilita Tanda como
            <span className="highlight-purple"> {translateWorkerType[workerTypeName] || workerTypeName}</span> en
            <span className="highlight-purple"> {hospitalName}</span>
          </h2>

          <div className="checkbox-group" style={{ marginTop: '1.5rem' }}>
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
              label={<>He leído y acepto los <a
                href={termsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >Términos y Condiciones</a></>}
              description=""
            />
            <Checkbox
              id="privacy"
              checked={acceptedPrivacy}
              onChange={() => setAcceptedPrivacy(!acceptedPrivacy)}
              label={<>He leído y acepto la <a
                href={privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >Política de Privacidad</a></>}
              description=""
            />
          </div>

          <div className="btn-group" style={{ marginTop: '2rem' }}>
            <Button
              label="Crear cuenta"
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              disabled={!acceptedTerms || !acceptedPrivacy || loadingForm}
              isLoading={loadingForm}
            />
            <Button
              label="Contactar con Tanda"
              variant="outline"
              size="lg"
              onClick={() => {
                trackEvent(EVENTS.ONBOARDING_CONTACT_CLICKED);
                navigate('/onboarding/code');
              }}
              disabled={loadingForm}
            />
          </div>
        </div>
      </div>
    </>
  );
}
