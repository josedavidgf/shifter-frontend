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
    const { getToken } = useAuth(); // para auth.uid
    const [swap, setSwap] = useState(null);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState('');

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



    // Mostrar chat solo si el estado lo permite
    const showChat = ['proposed', 'accepted'].includes(swap.status);

    return (
        <div className="container page">
            <h2 className="mb-3">Intercambio #{swap.swap_id}</h2>

            <div className="card mb-3">
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

            {swap.status === 'proposed' && swap.requester_id === workerId && (
                <div className="btn-group mb-4">
                    <button onClick={handleCancelSwap} className="btn btn-danger">
                        ❌ Cancelar intercambio
                    </button>
                </div>
            )}

            <BackButton />
        </div>

    );
};

export default SwapDetail;
