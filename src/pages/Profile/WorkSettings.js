// src/pages/profile/WorkSettings.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateWorkerHospital, updateWorkerSpeciality } from '../../services/userService';
import { validateAccessCode } from '../../services/accessCodeService';
import { getSpecialitiesByHospital } from '../../services/specialityService';
import { getHospitals } from '../../services/hospitalService';
import { getWorkerTypes } from '../../services/workerService';
import BackButton from '../../components/BackButton';


const WorkSettings = () => {
    const { getToken, refreshWorkerProfile } = useAuth();
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
            setError('Código inválido. Por favor verifica y vuelve a intentarlo.');
        }
    };


    const handleLoadSpecialities = async () => {
        const token = await getToken();
        const data = await getSpecialitiesByHospital(hospitalId, token);
        setSpecialities(data);
        setStep('speciality');
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
            console.error('Error guardando cambios:', err.message);
            setError('❌ Error guardando los cambios');
        }
    };

    if (!worker) return <p>Cargando datos...</p>;

    return (
        <div className="container page">
            <h2 className="mb-3">Ajustes profesionales</h2>

            {step === 'view' && (
                <div>
                    <p><strong>Hospital actual:</strong> {isWorker.workers_hospitals?.[0]?.hospitals?.name}</p>
                    <p><strong>Especialidad:</strong> {isWorker.workers_specialities?.[0]?.specialities?.speciality_category} - {worker.workers_specialities?.[0]?.specialities?.speciality_subcategory}</p>
                    <button className="btn btn-primary" onClick={() => setStep('code')}>Cambiar hospital y especialidad</button>
                </div>
            )}

            {step === 'code' && (
                <form onSubmit={handleValidateCode}>
                    <label>Introduce el nuevo código de acceso:</label>
                    <input type="text" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6} />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="btn-group">
                        <button type="submit" className="btn btn-primary">Validar</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setStep('view')}>Cancelar</button>
                    </div>
                </form>
            )}

            {step === 'confirm' && (
                <div>
                    <p><strong>Nuevo hospital ID:</strong> {hospitalId}</p>
                    <p><strong>Tipo de trabajador ID:</strong> {workerTypeId}</p>
                    <div className="btn-group">
                        <button className="btn btn-primary" onClick={handleLoadSpecialities}>Continuar</button>
                        <button className="btn btn-secondary" onClick={() => setStep('view')}>Cancelar</button>
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
                        <button className="btn btn-success" onClick={handleConfirmChanges}>Guardar cambios</button>
                        <button className="btn btn-secondary" onClick={() => setStep('view')}>Cancelar</button>
                    </div>
                </div>
            )}

            {message && <p className="mt-3">{message}</p>}
            <BackButton />
        </div>
    );
};

export default WorkSettings;