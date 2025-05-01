import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwapApi } from '../../api/useSwapApi';
import { useAuth } from '../../context/AuthContext';
import { useWorkerApi } from '../../api/useWorkerApi';
import useTrackPageView from '../../hooks/useTrackPageView';
import { useRespondFeedback } from '../../hooks/useRespondFeedback';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario
import { useToast } from '../../hooks/useToast'; // Ajusta ruta
import Loader from '../../components/ui/Loader/Loader';
import InputField from '../../components/ui/InputField/InputField';
import { format, parseISO } from 'date-fns';
import { shiftTypeLabels,swapStatusLabels } from '../../utils/labelMaps';



const SwapDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // swapId
    const { getToken } = useAuth(); // para auth.uid
    const { getMyWorkerProfile } = useWorkerApi();
    const { getSwapById, cancelSwap, respondToSwap, loading: loadingSwap, error: errorSwap } = useSwapApi(); // 🆕
    const [swap, setSwap] = useState(null);
    const [workerId, setWorkerId] = useState('');
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const { showSuccess, showError } = useToast();
    const showRespondFeedback = useRespondFeedback('toast'); // 👈 ahora usamos alert


    useTrackPageView('swap-detail');

    useEffect(() => {
        async function fetchSwap() {
            try {
                const token = await getToken();
                const swapData = await getSwapById(id, token);
                setSwap(swapData);

                const worker = await getMyWorkerProfile(token);
                setWorkerId(worker.worker_id);
            } catch (err) {
                console.error('❌ Error cargando detalle de swap:', err.message);
            }
        }

        fetchSwap();
    }, [id, getToken]);


    if (loadingSwap || !swap || !workerId) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader text="Cargando detalle del intercambio..." />
            </div>
        );
    }

    if (errorSwap) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{errorSwap}</p>
            </div>
        );
    }

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/calendar');
        }
    };

    const handleCancelSwap = async () => {
        const confirmCancel = window.confirm('¿Estás seguro de que quieres cancelar este intercambio?');
        if (!confirmCancel) return;

        setIsCancelling(true);
        try {
            const token = await getToken();
            const success = await cancelSwap(swap.swap_id, token);
            if (success) {
                showSuccess('Intercambio cancelado correctamente');
                navigate('/my-swaps');
            } else {
                showError('Error al cancelar el intercambio');
            }
        } catch (err) {
            console.error('❌ Error cancelando swap:', err.message);
            showError('Error inesperado al cancelar el intercambio');
        } finally {
            setIsCancelling(false);
        }
    };


    const handleRespond = async (decision) => {
        setIsAccepting(decision === 'accepted');
        setIsRejecting(decision === 'rejected');
        try {
            const token = await getToken();
            const success = await respondToSwap(swap.swap_id, decision, token);
            if (success) {
                showRespondFeedback(decision);
                navigate('/my-swaps');
            } else {
                showError('Error al actualizar el intercambio');
            }
        } catch (err) {
            console.error('❌ Error respondiendo swap:', err.message);
            showError('Error inesperado al actualizar el intercambio');
        } finally {
            setIsAccepting(false);
            setIsRejecting(false);
        }
    };

    const handleAcceptSwap = () => handleRespond('accepted');
    const handleRejectSwap = () => handleRespond('rejected');
/* 
    // Mostrar chat solo si el estado lo permite
    const showChat = ['proposed', 'accepted'].includes(swap.status); */


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
                        <InputField
                            name="original_shift_date"
                            label="Turno original"
                            value={`${swap.shift?.date ? format(parseISO(swap.shift.date), 'dd/MM/yyyy') : '-'} de ${shiftTypeLabels[swap.shift?.shift_type]}`}
                            disabled
                            readOnly
                        />
                        <InputField
                            name="offered_swap_date"
                            label="Turno ofrecido"
                            value={`${swap.offered_date ? format(parseISO(swap.offered_date), 'dd/MM/yyyy') : '-'} de ${shiftTypeLabels[swap.offered_type]}`}
                            disabled
                            readOnly
                        />
                        <InputField
                            name="status"
                            label="Estado"
                            value={swapStatusLabels[swap.status]}
                            disabled
                            readOnly
                        />
                    </div>
{/* 
                    {showChat && (
                        <div className="mb-3">
                            <ChatBox
                                swapId={swap.swap_id}
                                myWorkerId={swap.requester_id === workerId ? swap.requester_id : swap.shift.worker_id}
                                otherWorkerId={swap.requester_id === workerId ? swap.shift.worker_id : swap.requester_id}
                            />
                        </div>
                    )} */}
                    {swap.status === 'proposed' && swap.shift.worker_id === workerId && (
                        <div className="btn-group mb-4">
                            <Button
                                label="Aceptar intercambio"
                                variant="primary"
                                size="lg"
                                onClick={handleAcceptSwap}
                                isLoading={isAccepting}
                            />
                            <Button
                                label="Rechazar intercambio"
                                variant="danger"
                                size="lg"
                                onClick={handleRejectSwap}
                                isLoading={isRejecting}
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
                                isLoading={isCancelling}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SwapDetail;
