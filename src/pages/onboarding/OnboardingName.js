import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateWorkerInfo } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';


export default function OnboardingNameStep() {
  const [name, setFirstName] = useState('');
  const [surname, setLastName] = useState('');
  const [error, setError] = useState('');
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const {isWorker,refreshWorkerProfile} = useAuth();


  const handleConfirm = async () => {
    try {
      const token = await getToken();
      const workerId = sessionStorage.getItem('worker_id') || isWorker?.worker_id;
      if (!workerId || !name || !surname) {
        setError('Debes rellenar nombre y apellido.');
        return;
      }
      console.log('Worker ID:', workerId);
      console.log('Name:', name);
      console.log('Surname:', surname);
      console.log('Token:', token);
      await updateWorkerInfo({ workerId: workerId, name: name, surname: surname }, token);

      await refreshWorkerProfile();

      navigate('/onboarding/phone');
    } catch (err) {
      console.error('Error updating worker profile:', err.message);
      setError('Error guardando el nombre.');
    }
  };

  return (
    <div>
      <h2>Introduce tu nombre y apellido</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Apellido"
        value={surname}
        onChange={(e) => setLastName(e.target.value)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleConfirm}>Continuar</button>
    </div>
  );
}
