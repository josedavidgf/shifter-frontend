import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getHospitals } from '../services/hospitalService';
import { getSpecialities } from '../services/specialityService';
import {
  createWorkerHospital,
  createWorkerSpeciality,
  getMyWorkerProfile,
} from '../services/workerService';
import { useNavigate } from 'react-router-dom';

function OnboardingStep2() {
  const { getToken, completeOnboarding, logout } = useAuth();
  const navigate = useNavigate();

  const [workerId, setWorkerId] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [qualificationLevel, setQualificationLevel] = useState('resident');

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();

        // 🧠 1. Traemos el perfil del worker
        const worker = await getMyWorkerProfile(token);
        setWorkerId(worker.worker_id); // Esto es esencial para el POST
        console.log('ID del trabajador:', worker.worker_id);
        // 🏥 2. Traemos hospitales y especialidades en paralelo
        const [h, s] = await Promise.all([
          getHospitals(token),
          getSpecialities(token),
        ]);
        setHospitals(h);
        setSpecialities(s);
      } catch (err) {
        console.error('Error al obtener hospitales y especialidades:', err.message);
      }
    }

    fetchData();
  }, [getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();

    try {
      await createWorkerHospital(workerId, selectedHospital, token);
      await createWorkerSpeciality(workerId, selectedSpeciality, qualificationLevel, token);

      completeOnboarding();
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Error al completar onboarding:', err.message);
      alert('Error al guardar hospital/especialidad');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('Sesión cerrada');
    } catch (error) {
      console.log('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <div>
      <h2>Step 2: Hospital & Speciality</h2>

      <form onSubmit={handleSubmit}>
        <label>Hospital:</label>
        <select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} required>
          <option value="" disabled>Select hospital</option>
          {hospitals.map((h) => (
            <option key={h.hospital_id} value={h.hospital_id}>{h.name}</option>
          ))}
        </select>

        <label>Speciality:</label>
        <select value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)} required>
          <option value="" disabled>Select speciality</option>
          {specialities.map((s) => (
            <option key={s.speciality_id} value={s.speciality_id}>
              {s.speciality_category} - {s.speciality_subcategory}
            </option>
          ))}
        </select>

        <label>Qualification level:</label>
        <select value={qualificationLevel} onChange={(e) => setQualificationLevel(e.target.value)} required>
          <option value="resident">Resident</option>
          <option value="specialist">Specialist</option>
        </select>

        <button type="submit">Continue</button>
      </form>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default OnboardingStep2;
