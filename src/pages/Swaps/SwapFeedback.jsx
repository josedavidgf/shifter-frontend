// pages/SwapFeedback.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSwapApi } from '../../api/useSwapApi';
import { useAuth } from '../../context/AuthContext';
import { shiftTypeLabels } from '../../utils/labelMaps';
import { formatFriendlyDate } from '../../utils/formatFriendlyDate';
import illustration from '../../assets/illustration.png';
import FullScreenFeedback from '../../components/ui/Modal/FullScreenFeedback';
import useTrackPageView from '../../hooks/useTrackPageView';
import { trackEvent } from '../../hooks/useTrackPageView'; // Importamos la función de tracking
import { EVENTS } from '../../utils/amplitudeEvents'; // Importamos los eventos

export default function SwapFeedback() {
    const { swap_id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { getSwapById } = useSwapApi();

    const [swap, setSwap] = useState(null);
    const [loading, setLoading] = useState(true);

    useTrackPageView('swap-feedback');

    useEffect(() => {
        const fetchSwap = async () => {
            try {
                const token = await getToken();
                const swapData = await getSwapById(swap_id, token);
                setSwap(swapData);
            } catch (err) {
                console.error('❌ Error cargando swap:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSwap();
    }, [swap_id]);

    if (loading || !swap) return null;

    const isAccepted = swap.status === 'accepted';
    const offeredDate = formatFriendlyDate(swap.offered_date);
    const offeredTypeLabel = shiftTypeLabels[swap.offered_type] || swap.offered_type;
    const shiftOwnerName = swap.shift?.worker?.name || 'Desconocido';
    const shiftOwnerSurname = swap.shift?.worker?.surname || 'Desconocido';
    const shiftDate = formatFriendlyDate(swap.shift?.date);
    const shiftTypeLabel = shiftTypeLabels[swap.shift?.shift_type] || swap.shift?.shift_type || 'Desconocido';

    const title_1 = isAccepted ? (
        <>
            Turno propuesto y aceptado con{' '}
            <span className="highlight-purple">{shiftOwnerName} {shiftOwnerSurname}</span>
        </>
    ) : (
        <>
            Turno propuesto a{' '}
            <span className="highlight-purple">{shiftOwnerName} {shiftOwnerSurname}</span>
        </>

    );

    const title_2 = (
        <>
            Has propuesto cambiar tu turno del{' '}
            <span className="highlight-purple">{offeredDate}</span>{' '}
            de{' '}
            <span className="highlight-purple">{offeredTypeLabel}</span>{' '}
            por el del{' '}
            <span className="highlight-purple">{shiftDate}</span>{' '}
            de{' '}
            <span className="highlight-purple">{shiftTypeLabel}</span>
        </>
    );

    const description_1 = isAccepted ? (
        <>
            Tu compañero {shiftOwnerName} {shiftOwnerSurname} había marcado ese turno como disponible. El intercambio se ha realizado automáticamente.
        </>
    ) : (
        <>
            Ya hemos avisado a {shiftOwnerName} {shiftOwnerSurname}. Contestará lo antes posible. Podrás ver el estado del cambio en la sección “Mis cambios”.
        </>
    );


    return (
        <FullScreenFeedback
            illustration={illustration}
            title_1={title_1}
            title_2={title_2}
            description_1={description_1}
            ctaLabel="Genial"
            onClose={() => {
                // Trackear el evento SWAP_FEEDBACK_CTA_CLICKED
                trackEvent(EVENTS.SWAP_FEEDBACK_CTA_CLICKED, {
                    swapId: swap_id,
                    status: swap?.status,
                });
                navigate('/shifts/hospital');
            }}
        />
    );
}
