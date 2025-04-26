import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateWorkerInfo } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField/InputField';



export default function OnboardingNameStep() {
  const [name, setFirstName] = useState('');
  const [surname, setLastName] = useState('');
  const [error, setError] = useState('');
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { isWorker, refreshWorkerProfile } = useAuth();


  const handleConfirm = async () => {
    try {
      const token = await getToken();
      const workerId = isWorker?.worker_id;
      if (!workerId || !name || !surname) {
        setError('Debes rellenar nombre y apellido.');
        return;
      }
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


      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button className='btn btn-primary' onClick={handleConfirm}>Continuar</button>
    </div>
  );
}
