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


const HospitalShifts = () => {
    const { getToken } = useAuth();
    const { getHospitalShifts, loading: loadingShifts, error: errorShifts } = useShiftApi(); // 🆕
    const { getMyWorkerProfile } = useWorkerApi();
    const { getSentSwaps } = useSwapApi();
    const [shifts, setShifts] = useState([]);
    const [workerId, setWorkerId] = useState(null);
    const [sentSwaps, setSentSwaps] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true); // ✅ UNIFICADO
    const [error, setError] = useState(null); // ✅
    const navigate = useNavigate();



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
                const elapsed = Date.now() - startTime;
                const delay = Math.max(0, 600 - elapsed); // ✅ delay mínimo para suavizar UX
                setTimeout(() => {
                    setLoading(false);
                }, delay);
            }
        }

        fetchHospitalShifts();
    }, [getToken]);


    if (loading) {
        return <Loader text="Cargando turnos de tu servicio en tu hospital..." />;
    }

    if (error) {
        return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>;
    }

    if (!profile) {
        return <p>No se pudo cargar tu perfil.</p>;
    }

    return (
        <>
            <HeaderFirstLevel title="Turnos disponibles" />
            <div className="page">
                <div className="container">
                    {shifts.length === 0 ? (
                        <EmptyState
                            title="No hay turnos disponibles"
                            description="Actualmente no hay turnos publicados en tu hospital."
                            ctaLabel="Ir al calendario"
                            onCtaClick={() => navigate('/calendar')}
                        />
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
