import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useShiftApi } from '../../api/useShiftApi'; // ✅
import { useWorkerApi } from '../../api/useWorkerApi';
import { useSwapApi } from '../../api/useSwapApi';
import HospitalShiftsTable from '../../components/HospitalShiftsTable';
import useTrackPageView from '../../hooks/useTrackPageView';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import Loader from '../../components/ui/Loader/Loader'; // ✅
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import { useNavigate } from 'react-router-dom';
import useMinimumDelay from '../../hooks/useMinimumDelay';


const HospitalShifts = () => {
    const { getToken } = useAuth();
    const { getHospitalShifts, loading: loadingShifts, error: errorShifts } = useShiftApi(); // 🆕
    const { getMyWorkerProfile } = useWorkerApi();
    const { getSentSwaps } = useSwapApi();
    const [shifts, setShifts] = useState([]);
    const [workerId, setWorkerId] = useState(null);
    const [sentSwaps, setSentSwaps] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const showLoader = useMinimumDelay(loading, 500);



    useTrackPageView('hospital-shifts');

    useEffect(() => {
        async function fetchHospitalShifts() {
            setLoading(true);
            setError(null);

            const startTime = Date.now();

            try {
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
                setError('Error al cargar los turnos.');
            } finally {
                setLoading(false);
            }
        }

        fetchHospitalShifts();
    }, [getToken]);


    if (showLoader) {
        return <Loader text="Cargando turnos de tu servicio en tu hospital..." />;
    }

    if (error) {
        return (
            <EmptyState
                title="No se pudo cargar la información"
                description={error}
                ctaLabel="Reintentar"
                onCtaClick={() => window.location.reload()}
            />
        );
    }


    return (
        <>
            <HeaderFirstLevel title="Turnos disponibles" />
            <div className="page">
                <div className="container">
                    {!loading && shifts.length === 0 ? (
                        <EmptyState
                            title="No hay turnos publicados"
                            description="Actualmente no hay turnos publicados en este servicio."
                            ctaLabel="Ir al Calendario"
                            onCtaClick={() => navigate('/calendar')}
                        />
                    ) : null}

                    {!loading && shifts.length > 0 && (
                        <HospitalShiftsTable
                            shifts={shifts}
                            workerId={workerId}
                            sentSwapShiftIds={sentSwaps}
                            isLoading={loading}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default HospitalShifts;
