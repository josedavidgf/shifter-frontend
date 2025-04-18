import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  useEffect(() => {
    const hospital = sessionStorage.getItem('hospital_id');
    const workerType = sessionStorage.getItem('worker_type_id');
    const code = sessionStorage.getItem('access_code');


    if (!hospital || !workerType) {
      navigate('/onboarding/code');
    } else {
      setHospitalId(hospital);
      setWorkerTypeId(workerType);
      setAccessCode(code);
    }
  }, [navigate]);

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
      // Guardamos el workerId en sessionStorage para pasos siguientes
      sessionStorage.setItem('worker_id', response.worker.worker_id);
      sessionStorage.getItem('hospital_id')

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
