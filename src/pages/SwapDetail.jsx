import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSwapById} from '../services/swapService';
import ChatBox from '../components/ChatBox';
import { useAuth } from '../context/AuthContext';
import {
    getMyWorkerProfile,
  } from '../services/workerService';

const SwapDetail = () => {    
    const { id } = useParams(); // swapId
    console.log('🧾 ID del intercambio:', id);
    const { currentUser, getToken } = useAuth(); // para auth.uid
    console.log('🔑 ID del usuario autenticado:', currentUser.id);
    console.log('👤 Usuario autenticado:', currentUser);
    const [swap, setSwap] = useState(null);
    console.log('🔄 Estado inicial del intercambio:', swap);
    const [error, setError] = useState(null);
    const [workerId, setWorkerId] = useState('');
    

    useEffect(() => {
        async function fetchSwap() {
            try {
                const token = await getToken();
                console.log('🔑 Token de autenticación swap detail:', token);
                const data = await getSwapById(id,token);
                console.log('⚠️⚠️ Datos del intercambio swap detail:', data);
                setSwap(data);
                const worker = await getMyWorkerProfile(token);
                console.log('👤 Datos del trabajador:', worker);
                setWorkerId(worker.worker_id);
            } catch (err) {
                setError('No se pudo cargar el intercambio');
                console.error(err.message);
            }
        }
        fetchSwap();
    }, [id,getToken]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!swap) return <p>Cargando...</p>;

    // Mostrar chat solo si el estado lo permite
    const showChat = ['proposed', 'accepted'].includes(swap.status);

    return (
        <div>
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
        </div>
    );
};

export default SwapDetail;
