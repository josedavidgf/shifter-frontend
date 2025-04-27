import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createWorker, createWorkerHospital } from '../../services/workerService';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario

export default function OnboardingConfirmStep() {
  const [hospitalId, setHospitalId] = useState('');
  const [workerTypeId, setWorkerTypeId] = useState('');
  const [error, setError] = useState('');
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { setIsWorker, refreshWorkerProfile } = useAuth();

  const location = useLocation();
  const { hospital_id, worker_type_id, hospitalName, workerTypeName } = location.state || {};

  useEffect(() => {

    if (!hospital_id || !worker_type_id) {
      navigate('/onboarding/code');
    } else {
      setHospitalId(hospital_id);
      setWorkerTypeId(worker_type_id);
    }
  }, [hospital_id, worker_type_id, navigate]);
  

  const handleConfirm = async () => {
    const token = await getToken();

    try {
      const response = await createWorker({ workerTypeId }, token);
      if (response?.success) {
        alert('Trabajador creado con éxito');
        setIsWorker(true);
      } else {
        throw new Error(response?.message || 'Error al crear el trabajador');
      }

      await createWorkerHospital(response.worker.worker_id, hospitalId, token);

      await refreshWorkerProfile();

      navigate('/onboarding/speciality');
    } catch (err) {
      console.error('Error creando el worker:', err.message);
      setError('Error creando el perfil. Por favor inténtalo de nuevo.');
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
      <div className='page page-primary'>
        <div className='container'>
          <h2>El código que has introducido te habilita Tanda para {workerTypeName} en {hospitalName}</h2>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <Button
            label="Crear cuenta"
            variant="primary"
            size="lg"
            onClick={handleConfirm}
          />

          <hr />
          <Button
            label="Contactar con Tanda"
            variant="outline"
            size="lg"
            onClick={() => navigate('/onboarding/code')}
          />
        </div>
      </div>
    </>
  );
}
