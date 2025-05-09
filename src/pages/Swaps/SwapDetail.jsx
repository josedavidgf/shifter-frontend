import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { shiftTypeLabels, swapStatusLabels } from '../../utils/labelMaps';
import EmptyState from '../../components/ui/EmptyState/EmptyState';
import ConfirmationModal from '../../components/ui/ConfirmationModal/ConfirmationModal';
import useMinimumDelay from '../../hooks/useMinimumDelay';
import { formatFriendlyDate } from '../../utils/formatFriendlyDate';


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
    const showRespondFeedback = useRespondFeedback('toast');
    const [showCancelModal, setShowCancelModal] = useState(false);
    const showLoader = useMinimumDelay(loadingSwap || !swap || !workerId, 500);


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


    if (showLoader || !swap) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader text="Cargando detalle del intercambio..." minTime={50}/>
            </div>
        );
    }

    if (errorSwap) {
        return (
            <EmptyState
                title="No se pudo cargar el intercambio"
                description={errorSwap}
                ctaLabel="Volver al calendario"
                onCtaClick={() => navigate('/calendar')}
            />
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
        setShowCancelModal(true);
    };

    const confirmCancelSwap = async () => {
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
            setShowCancelModal(false);
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
                            value={`${formatFriendlyDate(swap.shift?.date)} de ${shiftTypeLabels[swap.shift?.shift_type]}`}
                            disabled
                            readOnly
                        />
                        <InputField
                            name="offered_swap_date"
                            label="Turno ofrecido"
                            value={`${formatFriendlyDate(swap.offered_date)} de ${shiftTypeLabels[swap.offered_type]}`}
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
                    {swap.status === 'proposed' && swap.shift.worker.worker_id === workerId && (
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
                                variant="outline"
                                size="lg"
                                onClick={handleCancelSwap}
                                isLoading={isCancelling}
                            />
                        </div>
                    )}
                    {swap.status === 'accepted' && (
                        <div className="mb-4">
                            <p className="text-sm mb-2">
                                ¿Ha habido algún problema con este intercambio? Ponte en <Link to='/profile/contact'> contacto con Tanda</Link> para ayudarte a gestionarlo.
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ConfirmationModal
                open={showCancelModal}
                title="¿Cancelar intercambio?"
                description="Esta acción no se puede deshacer. El otro trabajador dejará de verlo en su panel."
                confirmLabel="Sí, cancelar"
                cancelLabel="Volver"
                onConfirm={confirmCancelSwap}
                onCancel={() => setShowCancelModal(false)}
            />


        </>
    );
};

export default SwapDetail;
