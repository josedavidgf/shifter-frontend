import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecialitiesByHospital, addSpecialityToWorker } from '../../services/specialityService';
import { useAuth } from '../../context/AuthContext';



export default function OnboardingSpecialityStep() {
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken, isWorker, refreshWorkerProfile } = useAuth();


  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const token = await getToken();
        console.log('isWorker:', isWorker);
        console.log('isWorker hospital_id:', isWorker?.workers_hospitals?.[0]?.hospital_id);
        console.log('isWorker worker_id:', isWorker?.worker_id);
        console.log('isWorker worker_type_id:', isWorker?.worker_type_id);
  
        if (!isWorker?.workers_hospitals?.[0]?.hospital_id) {
          navigate('/onboarding/code');
          return;
        }
  
        const data = await getSpecialitiesByHospital(isWorker.workers_hospitals?.[0]?.hospital_id, token);
        setSpecialities(data);
      } catch (err) {
        console.error('Error fetching specialities:', err.message);
      }
    };
  
    fetchSpecialities();
  }, [getToken, isWorker, navigate]);
  
  const handleConfirm = async () => {
    try {
      const token = await getToken();
      const workerId = isWorker.worker_id;
  
      if (!workerId || !selectedSpeciality) {
        setError('Debes seleccionar una especialidad.');
        return;
      }
  
      await addSpecialityToWorker(workerId, selectedSpeciality, token);
      await refreshWorkerProfile();
      navigate('/onboarding/name');
    } catch (err) {
      console.error('Error adding speciality to worker:', err.message);
      setError('Error guardando la especialidad.');
    }
  };

  return (
    <div>
      <h2>Selecciona tu especialidad</h2>

      <select
        value={selectedSpeciality}
        onChange={(e) => setSelectedSpeciality(e.target.value)}
      >
        <option value="">Selecciona una especialidad</option>
        {specialities.map((spec) => (
          <option key={spec.speciality_id} value={spec.speciality_id}>
            {spec.speciality_category} - {spec.speciality_subcategory}
          </option>
        ))}
      </select>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleConfirm}>Confirmar especialidad</button>
    </div>
  );
}
