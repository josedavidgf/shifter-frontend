import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserApi } from '../../api/useUserApi';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField/InputField';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario


export default function OnboardingPhoneStep() {
  const [phone, setPhone] = useState('');
  const [prefix, setPrefix] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { updateWorkerInfo, loading, error: apiError } = useUserApi();
  const { isWorker, refreshWorkerProfile } = useAuth();

  useEffect(() => {
    if (!isWorker) {
      navigate('/onboarding/code'); // Redirige al primer paso para crear el worker
    }
  }, [isWorker]);


  const handleConfirm = async () => {
    try {
      const workerId = isWorker?.worker_id;
      const token = await getToken();
      if (!workerId) {
        setError('Error interno: falta worker_id.');
        return;
      }

      if (phone.trim()) {
        await updateWorkerInfo({ workerId: workerId, mobile_country_code: prefix, mobile_phone: phone }, token);
      }

      await refreshWorkerProfile();

      navigate('/onboarding/success');
    } catch (err) {
      console.error('Error updating phone:', err.message);
      setError('Error guardando el teléfono.');
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
      <div className="page page-secondary">
        <div className="container">
          <h2>Por último, añade tu número de teléfono</h2>
          <p>En Tanda ya tienes un chat para hablar con cualquiera de tus compañeros y gestionar los cambios. Si lo prefieres, añade tu número para facilitar la comunicación en caso de urgencia.</p>
          <InputField
            name="prefix"
            label="Prefijo"
            placeholder="Introduce tu prefijo"
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
          />

          <InputField
            name="phone"
            label="Teléfono"
            placeholder="Introduce tu teléfono"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {(error || apiError) && <p style={{ color: 'red' }}>{error || apiError}</p>}
          <Button
            label="Finizar registro"
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            disabled={!prefix || !phone}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
}
