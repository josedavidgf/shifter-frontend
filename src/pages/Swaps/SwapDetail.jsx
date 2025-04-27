import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSwapById, cancelSwap, respondToSwap } from '../../services/swapService';
import ChatBox from '../../components/ChatBox';
import { useAuth } from '../../context/AuthContext';
import { getMyWorkerProfile } from '../../services/workerService';
import useTrackPageView from '../../hooks/useTrackPageView';
import {useRespondFeedback} from '../../hooks/useRespondFeedback';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario


const SwapDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // swapId
    const { getToken } = useAuth(); // para auth.uid
    const [swap, setSwap] = useState(null);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState('');
    const showRespondFeedback = useRespondFeedback();


    useTrackPageView('swap-detail');

    useEffect(() => {
        async function fetchSwap() {
            try {
                const token = await getToken();
                const data = await getSwapById(id, token);
                setSwap(data);
                const worker = await getMyWorkerProfile(token);
                setWorkerId(worker.worker_id);
            } catch (err) {
                setError('No se pudo cargar el intercambio');
                console.error(err.message);
            }
        }
        fetchSwap();
    }, [id, getToken]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!swap) return <p>Cargando...</p>;

    const handleCancelSwap = async () => {
        const confirm = window.confirm('¿Estás seguro de que quieres cancelar este intercambio?');
        if (!confirm) return;

        try {
            const token = await getToken();
            await cancelSwap(swap.swap_id, token);
            alert('Intercambio cancelado correctamente');
            navigate('/my-swaps'); // ✅ Redirige a la lista de intercambios propuestos
        } catch (err) {
            console.error('Error al cancelar el intercambio:', err.message);
            alert('No se pudo cancelar el intercambio');
        }
    };

    const handleRespond = async (swapId, decision) => {
        try {
            const token = await getToken();
            await respondToSwap(swapId, decision, token);
            showRespondFeedback(decision); // 👈 Usamos el hook para mostrar el feedback

            navigate('/my-swaps');
        } catch (err) {
            console.error('❌ Error al responder al swap:', err.message);
            alert('Error al actualizar estado');
        }
    };

    const handleAcceptSwap = async () => {
        if (!swap) return;
        await handleRespond(swap.swap_id, 'accepted');
    };

    const handleRejectSwap = async () => {
        if (!swap) return;
        await handleRespond(swap.swap_id, 'rejected');
    };
    // Mostrar chat solo si el estado lo permite
    const showChat = ['proposed', 'accepted'].includes(swap.status);



    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/calendar');
        }
    };

    console.log('Swap:', swap);
    console.log('Worker ID:', workerId);
    console.log('Requester ID:', swap.requester_id);
    console.log('Swap shift worker:', swap.shift.worker_id);

    return (
        <>
            <HeaderSecondLevel
                title="Detalle del intercambio"
                showBackButton
                onBack={handleBack}
            />

            <div className="page">
                <div className="container">
                    <div className="card mb-3">
                        <p><strong>Intercambio #{swap.swap_id}</strong></p>
                        <p><strong>Turno original:</strong> {swap.shift.date}</p>
                        <p><strong>Turno ofrecido:</strong> {swap.offered_date}</p>
                        <p><strong>Estado:</strong> <span className={`status-badge status-${swap.status}`}>{swap.status}</span></p>
                    </div>

                    {showChat && (
                        <div className="mb-3">
                            <ChatBox
                                swapId={swap.swap_id}
                                myWorkerId={swap.requester_id === workerId ? swap.requester_id : swap.shift.worker_id}
                                otherWorkerId={swap.requester_id === workerId ? swap.shift.worker_id : swap.requester_id}
                            />
                        </div>
                    )}
                    {swap.status === 'proposed' && swap.shift.worker_id === workerId && (
                        <div className="btn-group mb-4">
                            <Button
                                label="Aceptar intercambio"
                                variant="primary"
                                size="lg"
                                onClick={handleAcceptSwap}
                            />
                            <Button
                                label="Rechazar intercambio"
                                variant="danger"
                                size="lg"
                                onClick={handleRejectSwap}
                            />
                        </div>
                    )}

                    {swap.status === 'proposed' && swap.requester_id === workerId && (
                        <div className="btn-group mb-4">
                            <Button
                                label="Cancelar intercambio"
                                variant="danger"
                                size="lg"
                                onClick={handleCancelSwap}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SwapDetail;
