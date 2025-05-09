import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAccessCodeApi } from '../../api/useAccessCodeApi';
import { useHospitalApi } from '../../api/useHospitalApi';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useSpecialityApi } from '../../api/useSpecialityApi';
import { useUserApi } from '../../api/useUserApi';
import InputField from '../../components/ui/InputField/InputField';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button/Button';
import { Briefcase, Buildings, CheckCircle } from '../../theme/icons';
import AccessCodeInput from '../../components/ui/AccessCodeInput/AccessCodeInput';
import { useToast } from '../../hooks/useToast';
import SpecialitiesTable from '../../components/SpecialitiesTable';
import Loader from '../../components/ui/Loader/Loader';
import useMinimumDelay from '../../hooks/useMinimumDelay';
import { translateWorkerType } from '../../utils/translateServices';


const WorkSettings = () => {
  const { getToken, refreshWorkerProfile, isWorker } = useAuth();
  const { validateAccessCode, loading: loadingAccessCode } = useAccessCodeApi();
  const { getHospitals } = useHospitalApi();
  const { getWorkerTypes } = useWorkerApi();
  const { getSpecialitiesByHospital } = useSpecialityApi();
  const { updateWorkerHospital, updateWorkerSpeciality, loading: loadingUserUpdate } = useUserApi();

  const [worker, setWorker] = useState(null);
  const [step, setStep] = useState('view');
  const [code, setCode] = useState('');
  const [hospitalId, setHospitalId] = useState(null);
  const [workerTypeId, setWorkerTypeId] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [workerTypeName, setWorkerTypeLabel] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);

  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const showLoader = useMinimumDelay(loadingInitial, 500);

  useEffect(() => {
    if (!isWorker) {
      showError('No tienes permisos para acceder a esta sección.');
      return;
    }
    setWorker(isWorker);
    setLoadingInitial(false);
  }, [isWorker]);

  const handleValidateCode = async (e) => {
    e.preventDefault();
    try {
      const response = await validateAccessCode(code);
      setHospitalId(response.hospital_id);
      setWorkerTypeId(response.worker_type_id);

      const token = await getToken();
      const hospitals = await getHospitals(token);
      const workerTypes = await getWorkerTypes(token);

      const hospital = hospitals.find(h => h.hospital_id === response.hospital_id);
      const workerType = workerTypes.find(w => w.worker_type_id === response.worker_type_id);

      setHospitalName(hospital?.name || response.hospital_id);
      setWorkerTypeLabel(translateWorkerType[workerType?.worker_type_name] || workerType?.worker_type_name || response.worker_type_id);
      setStep('confirm');
    } catch (err) {
      console.error('❌ Error en handleValidateCode:', err.message);
      showError('Código inválido. Por favor verifica y vuelve a intentarlo.');
    }
  };

  const handleLoadSpecialities = async () => {
    try {
      const token = await getToken();
      const effectiveHospitalId = hospitalId || isWorker?.workers_hospitals?.[0]?.hospital_id;

      if (!effectiveHospitalId) {
        showError('No se encontró el hospital.');
        return;
      }

      const data = await getSpecialitiesByHospital(effectiveHospitalId, token);
      setSpecialities(data);
      setStep('speciality');
    } catch (err) {
      console.error('❌ Error cargando especialidades:', err.message);
      showError('Error cargando especialidades.');
    }
  };

  const handleConfirmChanges = async () => {
    try {
      const token = await getToken();
      const effectiveHospitalId = hospitalId || isWorker?.workers_hospitals?.[0]?.hospital_id;

      if (!effectiveHospitalId || !selectedSpeciality) {
        showError('Selecciona una especialidad antes de continuar.');
        return;
      }

      await updateWorkerHospital({ hospital_id: effectiveHospitalId }, token);
      await updateWorkerSpeciality({ speciality_id: selectedSpeciality }, token);
      await refreshWorkerProfile();

      showSuccess('Cambios guardados');
      setStep('view');
    } catch (err) {
      console.error('❌ Error guardando cambios:', err.message);
      showError(err.message || 'Error guardando los cambios');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  if (showLoader) {
    return <Loader text="Cargando datos..." />;
  }

  return (
    <>
      <HeaderSecondLevel
        title="Situación profesional"
        showBackButton
        onBack={handleBack}
      />
      <div className="page page-secondary">
        <div className="container">

          {step === 'view' && (
            <div>
              <InputField
                name="hospital"
                label="Hospital"
                value={isWorker.workers_hospitals?.[0]?.hospitals?.name}
                disabled
                readOnly
              />
              <InputField
                name="worker-type"
                label="Profesión"
                value={translateWorkerType[isWorker.worker_types?.worker_type_name]}
                disabled
                readOnly
              />
              <InputField
                name="speciality"
                label="Servicio"
                value={isWorker.workers_specialities?.[0]?.specialities?.speciality_category}
                disabled
                readOnly
              />
              <div className="btn-group">
                <Button
                  label="Cambiar especialidad"
                  variant="primary"
                  leftIcon={<Briefcase size={20} />}
                  size="lg"
                  onClick={handleLoadSpecialities}
                />
                <Button
                  label="Cambiar hospital"
                  variant="outline"
                  leftIcon={<Buildings size={20} />}
                  size="lg"
                  onClick={() => {
                    setStep('code');
                    setSelectedSpeciality('');
                  }}
                />
              </div>
            </div>
          )}

          {step === 'code' && (
            <div>
              <h2>Introduce el código de invitación</h2>
              <p>Pregunta a tus compañeros por el código de invitación. De esta manera, aseguramos más privacidad en tu experiencia.</p>
              <form onSubmit={handleValidateCode}>
                <div className="access-code__container">
                  <AccessCodeInput
                    code={code}
                    setCode={setCode}
                  />
                </div>
                <div className="btn-group">
                  <Button
                    label="Validar"
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loadingAccessCode || !code}
                    isLoading={loadingAccessCode}
                  />
                </div>
              </form>
            </div>
          )}

          {step === 'confirm' && (
            <div>
              <h2 className="register-code__title">
                El código que has introducido te habilita Tanda como
                <span className="highlight-purple"> {workerTypeName}</span> en
                <span className="highlight-purple"> {hospitalName}</span>
              </h2>
              <div className="btn-group">
                <Button
                  label="Confirmar cambio"
                  leftIcon={<CheckCircle size={20} />}
                  variant="primary"
                  size="lg"
                  onClick={handleLoadSpecialities}
                  disabled={false}
                />
              </div>
            </div>
          )}

          {step === 'speciality' && (
            <div>
              <h2>Selecciona el servicio en el que trabajas:</h2>
              <SpecialitiesTable
                specialities={specialities}
                selectedSpeciality={selectedSpeciality}
                setSelectedSpeciality={setSelectedSpeciality}
              />
              <div className="btn-sticky-footer mt-2">
                <Button
                  label="Guardar cambios"
                  variant="primary"
                  size="lg"
                  onClick={handleConfirmChanges}
                  disabled={!selectedSpeciality || loadingUserUpdate}
                  isLoading={loadingUserUpdate}
                />
                {/* <Button
                  label="Descartar cambios"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep('view')}
                /> */}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default WorkSettings;
