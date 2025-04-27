import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecialitiesByHospital, addSpecialityToWorker } from '../../services/specialityService';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario



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
          <h2>Selecciona el servicio en el que trabajas</h2>

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

          <Button
              label="Continuar"
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedSpeciality} // Deshabilitar si no hay especialidad seleccionada
              />

        </div>
      </div>
    </>
  );
}
