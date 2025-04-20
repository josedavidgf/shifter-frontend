import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecialitiesByHospital, addSpecialityToWorker } from '../../services/specialityService';
import { useAuth } from '../../context/AuthContext';



export default function OnboardingSpecialityStep() {
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const {refreshWorkerProfile } = useAuth();


  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const token = await getToken();
        const hospitalId = sessionStorage.getItem('hospital_id');
        if (!hospitalId) {
          navigate('/onboarding/code');
          return;
        }
        const data = await getSpecialitiesByHospital(hospitalId, token);
        console.log('Data from backend:', data);
        setSpecialities(data);
        console.log('Specialities frontend:', data);
      } catch (err) {
        console.error('Error fetching specialities:', err.message);
      }
    };

    fetchSpecialities();
  }, [navigate, getToken]);

  const handleConfirm = async () => {
    try {
      const workerId = sessionStorage.getItem('worker_id');
      const token = await getToken();
      if (!workerId || !selectedSpeciality) {
        setError('Debes seleccionar una especialidad.');
        return;
      }
      console.log('Worker ID:', workerId);
      console.log('Selected speciality:', selectedSpeciality);
      console.log('Token:', token);
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
