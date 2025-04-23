import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSwapById, cancelSwap } from '../../services/swapService';
import ChatBox from '../../components/ChatBox';
import { useAuth } from '../../context/AuthContext';
import { getMyWorkerProfile } from '../../services/workerService';
import useTrackPageView from '../../hooks/useTrackPageView';
import BackButton from '../../components/BackButton';


const SwapDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // swapId
    //console.log('🧾 ID del intercambio:', id);
    const { getToken } = useAuth(); // para auth.uid
    //console.log('🔑 ID del usuario autenticado:', currentUser.id);
    //console.log('👤 Usuario autenticado:', currentUser);
    const [swap, setSwap] = useState(null);
    //console.log('🔄 Estado inicial del intercambio:', swap);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState('');

    useTrackPageView('swap-detail');

    useEffect(() => {
        async function fetchSwap() {
            try {
                const token = await getToken();
                //console.log('🔑 Token de autenticación swap detail:', token);
                const data = await getSwapById(id, token);
                //console.log('⚠️⚠️ Datos del intercambio swap detail:', data);
                setSwap(data);
                const worker = await getMyWorkerProfile(token);
                //console.log('👤 Datos del trabajador:', worker);
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



    // Mostrar chat solo si el estado lo permite
    const showChat = ['proposed', 'accepted'].includes(swap.status);

    return (
        <>
            <h2>Intercambio #{swap.swap_id}</h2>
            <p>Turno original: {swap.shift.date}</p>
            <p>Turno ofrecido: {swap.offered_date}</p>
            <p>Estado: {swap.status}</p>

            {showChat && (
                <ChatBox
                    swapId={swap.swap_id}
                    myWorkerId={swap.requester_id === workerId ? swap.requester_id : swap.shift.worker_id}
                    otherWorkerId={swap.requester_id === workerId ? swap.shift.worker_id : swap.requester_id}
                />
            )}
            <hr />
            {swap.status === 'proposed' && swap.requester_id === workerId && (
                <button onClick={handleCancelSwap} style={{ color: 'red' }}>
                    ❌ Cancelar intercambio
                </button>
            )}

            <hr />
            <BackButton />
        </>
    );
};

export default SwapDetail;
