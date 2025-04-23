import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getHospitalShifts } from '../../services/shiftService';
import { getSpecialities } from '../../services/specialityService';
import { getFullWorkerProfile } from '../../services/userService';
import HospitalShiftsTable from '../../components/HospitalShiftsTable';
import { getSentSwaps } from '../../services/swapService';
import useTrackPageView from '../../hooks/useTrackPageView';


const HospitalShifts = () => {
    const { getToken } = useAuth();
    const [shifts, setShifts] = useState([]);
    const [specialities, setSpecialities] = useState([]);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState(null);
    const [sentSwaps, setSentSwaps] = useState([]);

    useTrackPageView('hospital-shifts');

    useEffect(() => {
        async function fetchData() {
            try {
                const token = await getToken();
                const hospitalShifts = await getHospitalShifts(token);
                const specs = await getSpecialities(token);
                const profile = await getFullWorkerProfile(token);
                const swaps = await getSentSwaps(token); // 👈 nuevo
                setWorkerId(profile.worker_id);
                setShifts(hospitalShifts);
                setSpecialities(specs);
                setSentSwaps(swaps.map(s => s.shift_id)); // 👈 solo ids para comparar fácilmente
            } catch (err) {
                setError('Error al cargar los turnos del hospital');
            }
        }
        fetchData();
    }, [getToken]);

    return (
        <div>
            <h2>Turnos Disponibles en tu Hospital</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {shifts.length === 0 ? (
                <p>No hay turnos disponibles en tu hospital.</p>
            ) : (
                <HospitalShiftsTable
                    shifts={shifts}
                    specialities={specialities}
                    workerId={workerId}
                    sentSwapShiftIds={sentSwaps}
                />
            )}
        </div>
    );
};

export default HospitalShifts;
