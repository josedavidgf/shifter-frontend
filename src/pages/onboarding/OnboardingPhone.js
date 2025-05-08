import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserApi } from '../../api/useUserApi';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import PhoneInputGroup from '../../components/ui/PhoneInputGroup/PhoneInputGroup';
import { useToast } from '../../hooks/useToast';
import { phonePrefixes } from '../../utils/phonePrefixes';

export default function OnboardingPhoneStep() {
  const [phone, setPhone] = useState('');
  const [prefix, setPrefix] = useState('+34');
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { updateWorkerInfo } = useUserApi();
  const { isWorker, refreshWorkerProfile } = useAuth();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (!isWorker) {
      navigate('/onboarding/code');
    }
  }, [isWorker, navigate]);

  const handleConfirm = async () => {
    setLoadingForm(true);
    try {
      const workerId = isWorker?.worker_id;
      const token = await getToken();

      if (!workerId) {
        showError('Error interno: falta worker_id.');
        return;
      }

      const cleanedPhone = phone.replace(/\s+/g, '');
      const isValidPhone = /^\d{9}$/.test(cleanedPhone);
      const isValidPrefix = phonePrefixes.some(p => p.code === prefix);

      if (!isValidPhone || !isValidPrefix) {
        showError('El teléfono debe tener 9 dígitos y un prefijo válido.');
        return;
      }

      await updateWorkerInfo({
        workerId,
        mobile_country_code: prefix,
        mobile_phone: cleanedPhone
      }, token);

      await refreshWorkerProfile();
      showSuccess('Teléfono guardado correctamente');
      navigate('/onboarding/success');
    } catch (err) {
      console.error('❌ Error guardando teléfono:', err.message);
      showError('Error guardando el teléfono.');
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
          <h2>Por último, añade tu número de teléfono</h2>
          <p>
            En Tanda ya tienes un chat para hablar con tus compañeros y gestionar intercambios.
            Si lo prefieres, añade tu número para facilitar la comunicación en caso de urgencia.
          </p>

          <PhoneInputGroup
            prefix={prefix}
            phone={phone}
            onChange={({ prefix, phone }) => {
              setPhone(phone);
              setPrefix(prefix);
            }}
            prefixOptions={phonePrefixes.map(p => ({
              value: p.code,
              label: `${p.flag} ${p.code}`
            }))}
          />

          <Button
            label="Finalizar registro"
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            disabled={!phone || !prefix || loadingForm}
            isLoading={loadingForm}
          />
        </div>
      </div>
    </>
  );
}
