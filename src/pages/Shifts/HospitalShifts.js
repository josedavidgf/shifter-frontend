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
import Button from '../../components/ui/Button/Button';


const HospitalShifts = () => {
    const { getToken } = useAuth();
    const { getHospitalShifts, loading: loadingShifts, error: errorShifts } = useShiftApi(); // 🆕
    const { getMyWorkerProfile } = useWorkerApi();
    const { getSentSwaps } = useSwapApi();
    const [shifts, setShifts] = useState([]);
    const [page, setPage] = useState(0);
    const [workerId, setWorkerId] = useState(null);
    const [sentSwaps, setSentSwaps] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const showLoader = useMinimumDelay(loading, 500);
    const [hasMore, setHasMore] = useState(true); // ❗️añadir esto
    const [initialLoad, setInitialLoad] = useState(true);



    useTrackPageView('hospital-shifts');




    async function fetchHospitalShifts(initial = false) {
        if (initial) setInitialLoad(true); // 🆕

        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const limit = initial ? 10 : (page + 1) * 10;

            const [hospitalShiftsData, profileData, sentSwapsData] = await Promise.all([
                getHospitalShifts(token, limit, 0),
                getMyWorkerProfile(token),
                getSentSwaps(token),
            ]);

            if (initial) {
                setShifts(hospitalShiftsData);
                setInitialLoad(true); // solo en el primer fetch
            } else {
                setShifts(prev => {
                    const existingIds = new Set(prev.map(s => s.shift_id));
                    const newShifts = hospitalShiftsData.filter(s => !existingIds.has(s.shift_id));
                    return [...prev, ...newShifts];
                });
                setInitialLoad(false);
            }

            setProfile(profileData);
            setWorkerId(profileData.worker_id);
            setSentSwaps(sentSwapsData.map(s => s.shift_id));

            if (hospitalShiftsData.length < limit) {
                setHasMore(false);
            } else {
                setPage(prev => prev + 1);
            }
        } catch (err) {
            console.error('❌ Error al cargar datos de hospital:', err.message);
            setError('Error al cargar los turnos.');
        } finally {
            if (initial) setInitialLoad(false);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHospitalShifts(true); // primera página
    }, []);


    if (initialLoad) {
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
                        <>
                            <HospitalShiftsTable
                                shifts={shifts}
                                workerId={workerId}
                                sentSwapShiftIds={sentSwaps}
                                isLoading={loading}
                            />
                            {hasMore && (
                                <Button
                                    label="Ver más"
                                    onClick={() => fetchHospitalShifts()}
                                    isLoading={loading}
                                    variant="ghost"
                                    size="lg"
                                />
                            )}
                        </>
                    )}

                </div>
            </div>
        </>
    );
};

export default HospitalShifts;
