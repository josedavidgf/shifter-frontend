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
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario
import { Buildings } from '../../theme/icons'; // Icono de ejemplo


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
    const [, setHospitalName] = useState('');
    const [, setWorkerTypeLabel] = useState('');
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

            setMessage(`Código validado. Nuevo hospital: ${hospital?.name}, Tipo de trabajador: ${workerType?.worker_type_name}`);
            setStep('confirm');
        } catch (err) {
            console.error('❌ Error en handleValidateCode:', err.message);
            setError('Código inválido. Por favor verifica y vuelve a intentarlo.');
        }
    };



    const handleLoadSpecialities = async () => {
        const token = await getToken();
        try {
            const data = await getSpecialitiesByHospital(hospitalId, token);
            setSpecialities(data);
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
            await updateWorkerSpeciality({ speciality_id: selectedSpeciality }, token);
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
                            <p><strong>Hospital actual:</strong> {isWorker.workers_hospitals?.[0]?.hospitals?.name}</p>
                            <p><strong>Especialidad:</strong> {isWorker.workers_specialities?.[0]?.specialities?.speciality_category} - {worker.workers_specialities?.[0]?.specialities?.speciality_subcategory}</p>
                            <Button
                                label="Cambiar hospital"
                                variant="primary"
                                leftIcon={<Buildings size={20} />}
                                size="lg"
                                onClick={() => setStep('code')}
                            />
                        </div>
                    )}

                    {step === 'code' && (
                        <form onSubmit={handleValidateCode}>
                            <label>Introduce el nuevo código de acceso:</label>
                            <InputField
                                name="access-code"
                                label="Código de acceso"
                                placeholder="Introduce tu código de acceso"
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                required
                                error={error}
                                errorMessage="El código de acceso es obligatorio"
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="btn-group">
                                <Button
                                    label="Validar"
                                    variant="primary"
                                    size="lg"
                                    type="submit"
                                    disabled={loadingAccessCode || loadingHospitals || loadingWorkerTypes}
                                    isLoading={loadingAccessCode || loadingHospitals || loadingWorkerTypes} 
                                />
                                <Button
                                    label="Cancelar"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setStep('view')}
                                />
                            </div>
                        </form>
                    )}

                    {step === 'confirm' && (
                        <div>
                            <p><strong>Nuevo hospital ID:</strong> {hospitalId}</p>
                            <p><strong>Tipo de trabajador ID:</strong> {workerTypeId}</p>
                            <div className="btn-group">
                                <Button
                                    label="Continuar"
                                    variant="primary"
                                    size="lg"
                                    onClick={handleLoadSpecialities}
                                    disabled={loadingSpecialities}
                                    isLoading={loadingSpecialities}
                                />
                                <Button
                                    label="Cancelar"
                                    variant="outline"
                                    size="lg"
                                    onClick={() => setStep('view')}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'speciality' && (
                        <div>
                            <label>Selecciona tu especialidad:</label>
                            <select value={selectedSpeciality} onChange={(e) => setSelectedSpeciality(e.target.value)}>
                                <option value="">Selecciona una especialidad</option>
                                {specialities.map((s) => (
                                    <option key={s.speciality_id} value={s.speciality_id}>
                                        {s.speciality_category} - {s.speciality_subcategory}
                                    </option>
                                ))}
                            </select>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <div className="btn-group mt-3">
                                <Button
                                    label="Guardar cambios"
                                    variant="primary"
                                    size="lg"
                                    onClick={handleConfirmChanges}
                                    disabled={loadingUserUpdate}
                                    isLoading={loadingUserUpdate}
                                />
                                <Button
                                    label="Cancelar"
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