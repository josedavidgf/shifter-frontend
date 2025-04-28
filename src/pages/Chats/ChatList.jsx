import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useSwapApi } from '../../api/useSwapApi';
import ChatBox from '../../components/ChatBox';
import { formatDate, getVerb, getOtherVerb } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import HeaderFirstLevel from '../../components/ui/Header/HeaderFirstLevel';
import Loader from '../../components/ui/Loader/Loader';

const ChatsList = () => {
    const { getToken } = useAuth();
    const { getMyWorkerProfile } = useWorkerApi();
    const { getAcceptedSwaps } = useSwapApi();
    const [swaps, setSwaps] = useState([]);
    const [workerId, setWorkerId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            const startTime = Date.now();

            try {
                const token = await getToken();
                const worker = await getMyWorkerProfile(token);
                setWorkerId(worker.worker_id);

                const swapsData = await getAcceptedSwaps(token);
                if (swapsData) {
                    setSwaps(swapsData);
                }
            } catch (err) {
                console.error('❌ Error cargando chats:', err.message);
                setError('Error al cargar chats activos.');
            } finally {
                const elapsed = Date.now() - startTime;
                const delay = Math.max(0, 600 - elapsed);
                setTimeout(() => {
                    setLoading(false);
                }, delay);
            }
        }

        fetchData();
    }, [getToken]);

    const isActive = (swap) => {
        const turnoDate = new Date(swap.shift.date);
        const offeredDate = new Date(swap.offered_date);
        const maxDate = turnoDate > offeredDate ? turnoDate : offeredDate;

        return new Date() <= maxDate;
    };

    if (loading) {
        return <Loader text="Cargando chats activos..." />;
    }

    if (error) {
        return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>{error}</p>;
    }

    const activeSwaps = swaps.filter(isActive);

    return (
        <>
            <HeaderFirstLevel title="Chats activos" />
            <div className="page page-secondary">
                <div className="container">
                    {activeSwaps.length === 0 ? (
                        <p style={{ textAlign: 'center', marginTop: '2rem' }}>No tienes chats activos ahora mismo.</p>
                    ) : (
                        <div className="chat-list">
                            {activeSwaps.map((swap) => {
                                const iAmRequester = swap.requester_id === workerId;
                                const myDate = iAmRequester ? swap.offered_date : swap.shift.date;
                                const myDateType = iAmRequester ? swap.offered_type : swap.shift.shift_type;
                                const otherDate = iAmRequester ? swap.shift.date : swap.offered_date;
                                const otherType = iAmRequester ? swap.shift.shift_type : swap.offered_type;
                                const otherPersonName = iAmRequester
                                    ? `${swap.shift.worker?.name} ${swap.shift.worker?.surname}`
                                    : `${swap.requester?.name} ${swap.requester?.surname}`;

                                return (
                                    <div
                                        key={swap.swap_id}
                                        className="chat-card"
                                        onClick={() => navigate(`/chats/${swap.swap_id}`)}
                                    >
                                        <strong>Intercambio #{swap.swap_id}</strong>
                                        <span>
                                            {getVerb(myDate)} el {formatDate(myDate)} {myDateType} y {otherPersonName} {getOtherVerb(otherDate)} el {formatDate(otherDate)} {otherType}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChatsList;
