import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createWorker, createWorkerHospital } from '../../services/workerService';
import { useAuth } from '../../context/AuthContext';


export default function OnboardingConfirmStep() {
  const [hospitalId, setHospitalId] = useState('');
  const [workerTypeId, setWorkerTypeId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { setIsWorker, refreshWorkerProfile } = useAuth();

  const location = useLocation();
  const { hospital_id, worker_type_id, access_code } = location.state || {};

  useEffect(() => {


    if (!hospital_id || !worker_type_id) {
      navigate('/onboarding/code');
    } else {
      setHospitalId(hospital_id);
      setWorkerTypeId(worker_type_id);
      setAccessCode(access_code);
    }
  }, [hospital_id, worker_type_id, access_code, navigate]);

  const handleConfirm = async () => {
    const token = await getToken();

    try {
      console.log('Datos a enviar:', workerTypeId);
      console.log('Token:', token);
      const response = await createWorker({ workerTypeId }, token);
      console.log('Response:', response);
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

  return (
    <div>
      <h2>Confirmar hospital y rol</h2>
      <p><strong>Hospital ID:</strong> {hospitalId}</p>
      <p><strong>Tipo de trabajador ID:</strong> {workerTypeId}</p>
      <p><strong>Código:</strong> {accessCode}</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleConfirm}>Confirmar y continuar</button>
      <button onClick={() => navigate('/onboarding/code')}>Cancelar</button>
    </div>
  );
}
