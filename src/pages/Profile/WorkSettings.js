// src/pages/profile/WorkSettings.jsx

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
import { Briefcase, Buildings, CheckCircle, CheckSquare } from '../../theme/icons';
import SearchSelectInput from '../../components/ui/SearchSelectInput/SearchSelectInput';
import AccessCodeInput from '../../components/ui/AccessCodeInput/AccessCodeInput';




const WorkSettings = () => {
    const { getToken, refreshWorkerProfile } = useAuth();
    const { validateAccessCode, loading: loadingAccessCode, error: errorAccessCode } = useAccessCodeApi();
    const { getHospitals, loading: loadingHospitals, error: errorHospitals } = useHospitalApi();
    const { getWorkerTypes, loading: loadingWorkerTypes, error: errorWorkerTypes } = useWorkerApi();
    const { getSpecialitiesByHospital, loading: loadingSpecialities, error: errorSpecialities } = useSpecialityApi();
    const { updateWorkerHospital, updateWorkerSpeciality, loading: loadingUserUpdate, error: errorUserUpdate } = useUserApi();
    const [worker, setWorker] = useState(null);
    const [step, setStep] = useState('view');
    const [code, setCode] = useState('');
    const [hospitalId, setHospitalId] = useState(null);
    const [workerTypeId, setWorkerTypeId] = useState(null);
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { isWorker } = useAuth();
    const [hospitalName, setHospitalName] = useState('');
    const [workerTypeName, setWorkerTypeLabel] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        if (!isWorker) {
            setError('No tienes permisos para acceder a esta sección.');
            return;
        }
        setWorker(isWorker);
    }, [isWorker]);


    const handleValidateCode = async (e) => {
        e.preventDefault();
        setError('');
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
            setWorkerTypeLabel(workerType?.worker_type_name || response.worker_type_id);
            setStep('confirm');
        } catch (err) {
            console.error('❌ Error en handleValidateCode:', err.message);
            setError('Código inválido. Por favor verifica y vuelve a intentarlo.');
        }
    };



    const handleLoadSpecialities = async () => {
        const token = await getToken();
        const hospital = await getHospitals(token);
        console.log('hospital', hospital);
        const hospitalId = hospital?.[0]?.hospital_id;
        if (!hospitalId) {
            setError('No se encontró el hospital.');
            return;
        }

        try {
            const data = await getSpecialitiesByHospital(hospitalId, token);
            setSpecialities(data);
            console.log('specialities data', data);
            setStep('speciality');
        } catch (error) {
            console.error('❌ Error cargando especialidades:', error.message);
            setError('Error cargando especialidades.');
        }
    };


    const handleConfirmChanges = async () => {
        try {
            const token = await getToken();

            await updateWorkerHospital({ hospital_id: hospitalId }, token);
            await updateWorkerSpeciality({ speciality_id: selectedSpeciality.value }, token);
            await refreshWorkerProfile();
            setMessage('✅ Cambios guardados');
            setStep('view');
        } catch (err) {
            console.error('❌ Error guardando cambios:', err.message);
            setError('❌ Error guardando los cambios');
        }
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/calendar');
        }
    };

    if (!worker) return <p>Cargando datos...</p>;

    const specialityOptions = specialities.map((s) => ({
        value: s.speciality_id,
        label: s.speciality_category,
    }));
    console.log('worker', worker);
    console.log('isWorker', isWorker);
    console.log('specialities', specialities);
    console.log('specialities', specialityOptions);

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
                                value={isWorker.worker_types?.worker_type_name}
                                disabled
                                readOnly
                            />
                            <InputField
                                name="speciality"
                                label="Servicio"
                                value={isWorker.workers_specialities?.[0]?.specialities?.speciality_category + ' - ' + isWorker.workers_specialities?.[0]?.specialities?.speciality_subcategory}
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
                                    onClick={() => setStep('code')}
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
                                        error={error}
                                    />
                                </div>
                                <div className="btn-group">
                                    <Button
                                        label="Validar"
                                        variant="primary"
                                        size="lg"
                                        type="submit"
                                        disabled={loadingAccessCode || loadingHospitals || loadingWorkerTypes || !code}
                                        isLoading={loadingAccessCode || loadingHospitals || loadingWorkerTypes}
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
                                    disabled={loadingSpecialities}
                                    isLoading={loadingSpecialities}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'speciality' && (
                        <div>
                            <h2>Selecciona el servicio en el que trabajas:</h2>

                            <SearchSelectInput
                                options={specialityOptions}
                                onSelect={(option) => setSelectedSpeciality(option)}
                                placeholder="Busca por categoría"
                                noResultsText="No encontramos servicios que coincidan"
                                helperText="Selecciona el servicio en el que trabajas"
                                errorText={error}
                            />
                            <div className="btn-group mt-3">
                                <Button
                                    label="Guardar cambios"
                                    variant="primary"
                                    size="lg"
                                    onClick={handleConfirmChanges}
                                    disabled={!selectedSpeciality || loadingUserUpdate}
                                    isLoading={loadingUserUpdate}
                                />
                                <Button
                                    label="Descartar cambios"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setStep('view')}
                                />
                            </div>
                        </div>
                    )}

                    {message && <p className="mt-3">{message}</p>}
                </div>
            </div>
        </>
    );
};

export default WorkSettings;