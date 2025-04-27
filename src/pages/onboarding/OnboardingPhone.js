import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateWorkerInfo } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField/InputField';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';



export default function OnboardingPhoneStep() {
  const [phone, setPhone] = useState('');
  const [prefix, setPrefix] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isWorker, refreshWorkerProfile } = useAuth();


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

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button 
            className='btn btn-primary' 
            onClick={handleConfirm}
            disabled={!prefix || !phone}
            >
              Finalizar registro
            </button>
        </div>
      </div>
    </>
  );
}
