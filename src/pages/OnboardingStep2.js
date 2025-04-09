import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/hospitalService';
import { getSpecialities } from '../services/specialityService';
import { createWorkerHospital, createWorkerSpeciality } from '../services/workerService';
import { useNavigate } from 'react-router-dom';

function OnboardingStep2() {
  const { currentUser, getToken, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [qualificationLevel, setQualificationLevel] = useState('resident');

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      const [hData, sData] = await Promise.all([
        getHospitals(token),
        getSpecialities(token),
      ]);
      setHospitals(hData);
      setSpecialities(sData);
    };
    fetchData();
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();

    try {
      await createWorkerHospital(currentUser.id, selectedHospital, token);
      await createWorkerSpeciality(currentUser.id, selectedSpeciality, qualificationLevel, token);

      completeOnboarding(); // actualiza estado + localStorage
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error al completar onboarding:', err.message);
      alert('Error al guardar hospital/especialidad');
    }
  };

  return (
    <div>
      <h2>Step 2: Hospital & Speciality</h2>
      <form onSubmit={handleSubmit}>
        <label>Hospital:</label>
        <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} required>
          <option value="" disabled>Select hospital</option>
          {hospitals.map(h => (
            <option key={h.hospital_id} value={h.hospital_id}>{h.name}</option>
          ))}
        </select>

        <label>Speciality:</label>
        <select value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)} required>
          <option value="" disabled>Select speciality</option>
          {specialities.map(s => (
            <option key={s.speciality_id} value={s.speciality_id}>{s.speciality_category} - {s.speciality_subcategory}</option>
          ))}
        </select>

        <label>Qualification level:</label>
        <select value={qualificationLevel} onChange={(e) => setQualificationLevel(e.target.value)} required>
          <option value="resident">Resident</option>
          <option value="specialist">Specialist</option>
        </select>

        <button type="submit">Continue</button>
      </form>
    </div>
  );
}

export default OnboardingStep2;
