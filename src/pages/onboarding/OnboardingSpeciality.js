import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpecialityApi } from '../../api/useSpecialityApi';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import SpecialitiesTable from '../../components/SpecialitiesTable';
import Loader from '../../components/ui/Loader/Loader';
import useMinimumDelay from '../../hooks/useMinimumDelay';
import { useToast } from '../../hooks/useToast';

export default function OnboardingSpecialityStep() {
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [saving, setSaving] = useState(false);


  const navigate = useNavigate();
  const { getToken, isWorker, refreshWorkerProfile } = useAuth();
  const {
    getSpecialitiesByHospital,
    addSpecialityToWorker,
    loading
  } = useSpecialityApi();
  const { showError } = useToast();

  const showLoader = useMinimumDelay(loadingInitial, 400);

  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const token = await getToken();
        const hospitalId = isWorker?.workers_hospitals?.[0]?.hospital_id;

        if (!hospitalId) {
          navigate('/onboarding/code');
          return;
        }

        const data = await getSpecialitiesByHospital(hospitalId, token);
        setSpecialities(data);
      } catch (err) {
        console.error('❌ Error fetching specialities:', err.message);
        showError('Error cargando especialidades.');
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchSpecialities();
  }, [getToken, isWorker, navigate, getSpecialitiesByHospital, showError]);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const token = await getToken();
      const workerId = isWorker?.worker_id;

      if (!workerId || !selectedSpeciality) {
        showError('Debes seleccionar una especialidad antes de continuar.');
        return;
      }

      await addSpecialityToWorker(workerId, selectedSpeciality, token);
      await refreshWorkerProfile();
      navigate('/onboarding/name');
    } catch (err) {
      console.error('❌ Error adding speciality to worker:', err.message);
      showError('Error guardando la especialidad.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  if (showLoader) return <Loader text="Cargando especialidades..." minTime={50}/>;

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
          <div className="btn-sticky-footer mt-2">
            <Button
              label="Continuar"
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              disabled={!selectedSpeciality || saving}
              isLoading={saving}
            />
          </div>
        </div>
      </div>
    </>
  );
}