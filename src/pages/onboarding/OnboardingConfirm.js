import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../hooks/useToast';
import Loader from '../../components/ui/Loader/Loader';

export default function OnboardingConfirmStep() {
  const [hospitalId, setHospitalId] = useState('');
  const [workerTypeId, setWorkerTypeId] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);

  const { getToken, setIsWorker, refreshWorkerProfile } = useAuth();
  const { createWorker, createWorkerHospital } = useWorkerApi();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const location = useLocation();
  const { hospital_id, worker_type_id, hospitalName, workerTypeName } = location.state || {};

  useEffect(() => {
    if (!hospital_id || !worker_type_id) {
      navigate('/onboarding/code');
    } else {
      setHospitalId(hospital_id);
      setWorkerTypeId(worker_type_id);
    }
  }, [hospital_id, worker_type_id, navigate]);

  const handleConfirm = async () => {
    setLoadingForm(true);
    try {
      const token = await getToken();

      const response = await createWorker({ workerTypeId }, token);
      if (!response?.success) {
        throw new Error(response?.message || 'Error al crear el trabajador');
      }

      await createWorkerHospital(response.worker.worker_id, hospitalId, token);
      await refreshWorkerProfile();

      showSuccess('Trabajador creado con éxito');
      navigate('/onboarding/speciality');
    } catch (err) {
      console.error('❌ Error creando el worker:', err.message);
      showError('Error creando el perfil. Por favor inténtalo de nuevo.');
    } finally {
      setLoadingForm(false);
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
      <div className="page page-primary">
        <div className="container">
          <h2 className="register-code__title">
            El código que has introducido te habilita Tanda como
            <span className="highlight-purple"> {workerTypeName}</span> en
            <span className="highlight-purple"> {hospitalName}</span>
          </h2>

          <div className="btn-group">
            <Button
              label="Crear cuenta"
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              disabled={loadingForm}
              isLoading={loadingForm}
            />
            <Button
              label="Contactar con Tanda"
              variant="outline"
              size="lg"
              onClick={() => navigate('/onboarding/code')}
              disabled={loadingForm}
            />
          </div>
        </div>
      </div>
    </>
  );
}
