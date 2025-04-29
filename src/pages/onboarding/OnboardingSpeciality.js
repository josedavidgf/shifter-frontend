import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecialityApi } from '../../api/useSpecialityApi';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import SpecialitiesTable from '../../components/SpecialitiesTable';

export default function OnboardingSpecialityStep() {
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { getToken, isWorker, refreshWorkerProfile } = useAuth();
  const { getSpecialitiesByHospital, addSpecialityToWorker, loading, error: apiError } = useSpecialityApi();

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

          <SpecialitiesTable
            specialities={specialities}
            selectedSpeciality={selectedSpeciality}
            setSelectedSpeciality={setSelectedSpeciality}
          />

          {(error || apiError) && <p style={{ color: 'red' }}>{error || apiError}</p>}

          <Button
            label="Continuar"
            variant="primary"
            size="lg"
            onClick={handleConfirm}
            disabled={!selectedSpeciality} // Solo habilitado si seleccionan algo
          />
        </div>
      </div>
    </>
  );
}
