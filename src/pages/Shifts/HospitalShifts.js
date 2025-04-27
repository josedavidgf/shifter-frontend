import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShiftApi } from '../../api/useShiftApi'; // ✅
import { useWorkerApi } from '../../api/useWorkerApi';
import { useSwapApi } from '../../api/useSwapApi';
import HospitalShiftsTable from '../../components/HospitalShiftsTable';
import useTrackPageView from '../../hooks/useTrackPageView';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';



const HospitalShifts = () => {
    const { getToken } = useAuth();
    const { getHospitalShifts, loading: loadingShifts, error: errorShifts } = useShiftApi(); // 🆕
    const { getMyWorkerProfile } = useWorkerApi();
    const { getSentSwaps } = useSwapApi();
    const [shifts, setShifts] = useState([]);
    const [workerId, setWorkerId] = useState(null);
    const [sentSwaps, setSentSwaps] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);


    useTrackPageView('hospital-shifts');

    useEffect(() => {
        async function fetchData() {
            try {
                setLoadingProfile(true);
                const token = await getToken();
                const [hospitalShiftsData, profileData, sentSwapsData] = await Promise.all([
                    getHospitalShifts(token),
                    getMyWorkerProfile(token),
                    getSentSwaps(token),
                ]);

                setProfile(profileData);
                setWorkerId(profileData.worker_id);
                setShifts(hospitalShiftsData);
                setSentSwaps(sentSwapsData.map(s => s.shift_id));
            } catch (err) {
                console.error('❌ Error al cargar datos de hospital:', err.message);
            } finally {
                setLoadingProfile(false);
            }
        }

        fetchData();
    }, [getToken]); // ✅ solo dependemos de getToken, que es estable


    if (loadingProfile || loadingShifts) {
        return <p>Cargando turnos disponibles...</p>;
    }

    if (errorShifts) {
        return <p style={{ color: 'red' }}>{errorShifts}</p>;
    }

    if (!profile) {
        return <p>No se pudo cargar tu perfil.</p>;
    }

    return (
        <>
            <HeaderFirstLevel title="Turnos disponibles" />
            <div className="page page-primary">
                <div className="container">
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
            </div>
        </>
    );
};

export default HospitalShifts;
