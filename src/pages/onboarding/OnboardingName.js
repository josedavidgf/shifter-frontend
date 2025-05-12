import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateWorkerInfo } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField/InputField';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../hooks/useToast';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';
import useTrackPageView from '../../hooks/useTrackPageView';

export default function OnboardingNameStep() {
  const [name, setFirstName] = useState('');
  const [surname, setLastName] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const { getToken, isWorker, refreshWorkerProfile } = useAuth();
  const navigate = useNavigate();
  const { showError } = useToast();

  useTrackPageView('onboarding-name');

  useEffect(() => {
    if (!isWorker) {
      navigate('/onboarding/code');
    }
  }, [isWorker, navigate]);

  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const handleConfirm = async () => {
    trackEvent(EVENTS.ONBOARDING_NAME_SUBMITTED, {
      name: name.trim(),
      surname: surname.trim(),
    });
    setLoadingForm(true);
    try {
      const token = await getToken();
      const workerId = isWorker?.worker_id;

      if (!workerId || !name || !surname) {
        showError('Debes rellenar nombre y apellidos.');
        return;
      }

      const formattedName = capitalizeWords(name);
      const formattedSurname = capitalizeWords(surname);

      await updateWorkerInfo(
        {
          workerId,
          name: formattedName,
          surname: formattedSurname,
        },
        token
      );

      await refreshWorkerProfile();
      trackEvent(EVENTS.ONBOARDING_NAME_SUCCESS, {
        name: capitalizeWords(name),
        surname: capitalizeWords(surname),
      });

      navigate('/onboarding/phone');
    } catch (err) {
      console.error('❌ Error updating worker profile:', err.message);
      trackEvent(EVENTS.ONBOARDING_NAME_FAILED, {
        error: err.message,
      });
      showError('Error guardando el nombre. Intenta de nuevo.');
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
      <HeaderSecondLevel showBackButton onBack={handleBack} />
      <div className="page page-secondary">
        <div className="container">
          <h2>Añade tu nombre y apellidos</h2>

          <InputField
            name="first-name"
            label="Nombre"
            placeholder="Introduce tu nombre"
            type="text"
            value={name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <InputField
            name="last-name"
            label="Apellido"
            placeholder="Introduce tu apellido"
            type="text"
            value={surname}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <Button
            label="Continuar"
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            disabled={!name || !surname || loadingForm}
            isLoading={loadingForm}
          />
        </div>
      </div>
    </>
  );
}
