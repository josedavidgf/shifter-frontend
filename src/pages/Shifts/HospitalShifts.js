import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHospitalShifts } from '../../services/shiftService';
import { getMyWorkerProfile } from '../../services/workerService';
import HospitalShiftsTable from '../../components/HospitalShiftsTable';
import { getSentSwaps } from '../../services/swapService';
import useTrackPageView from '../../hooks/useTrackPageView';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';



const HospitalShifts = () => {
    const { getToken } = useAuth();
    const [shifts, setShifts] = useState([]);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const [sentSwaps, setSentSwaps] = useState([]);
    const [profile, setProfile] = useState(null);


    useTrackPageView('hospital-shifts');

    useEffect(() => {
        async function fetchData() {
            try {
                const token = await getToken();
                const hospitalShifts = await getHospitalShifts(token);
                const profile = await getMyWorkerProfile(token);
                const swaps = await getSentSwaps(token); // 👈 nuevo
                setProfile(profile);
                setWorkerId(profile.worker_id);
                setShifts(hospitalShifts);
                setSentSwaps(swaps.map(s => s.shift_id)); // 👈 solo ids para comparar fácilmente
            } catch (err) {
                setError('Error al cargar los turnos del hospital');
            }
        }
        fetchData();
    }, [getToken]);

    // ⚠️ PROTECCIÓN OBLIGATORIA
    if (!profile) return <p>Cargando perfil...</p>;

    // ✅ YA SE PUEDE ACCEDER
    //const hospitalName = profile.workers_hospitals?.[0]?.hospitals?.name;
    //const specialityCategory = profile.workers_specialities?.[0]?.specialities?.speciality_category;
    //const specialitySubcategory = profile.workers_specialities?.[0]?.specialities?.speciality_subcategory;

    return (
        <>
            <HeaderFirstLevel
                title="Turnos disponibles"
            />
            <div className="container page">
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {shifts.length === 0 ? (
                    <p>No hay turnos disponibles en tu hospital.</p>
                ) : (
                    <HospitalShiftsTable
                        shifts={shifts}
                        workerId={workerId}
                        sentSwapShiftIds={sentSwaps}
                    />
                )}
            </div>
        </>
    );
};

export default HospitalShifts;
