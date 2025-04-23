import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSwapsByShiftId } from '../../services/swapService';
import ChatBox from '../../components/ChatBox';
import useTrackPageView from '../../hooks/useTrackPageView';

const ShiftDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // shiftId
    const { getToken } = useAuth(); // asegúrate de tener el workerId
    const [swaps, setSwaps] = useState([]);
    const [error, setError] = useState(null);

    useTrackPageView('shift-detail');

    useEffect(() => {
        async function fetchSwaps() {
            try {
                const token = await getToken();
                const data = await getSwapsByShiftId(id, token);
                setSwaps(data);
            } catch (err) {
                setError('No se pudieron cargar los intercambios');
                console.error(err.message);
            }
        }

        fetchSwaps();
    }, [id, getToken]);

    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Turno #{id}</h2>

            {swaps.length === 0 && <p>Este turno no tiene intercambios activos.</p>}

            {swaps.map((swap) => (
                <div key={swap.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                    <h4>Intercambio propuesto</h4>
                    <p>Turno original: {swap.shift.date}</p>
                    <p>Fecha ofrecida: {swap.offered_date}</p>
                    <p>Tipo ofrecido: {swap.offered_type}</p>
                    <p>Estado: {swap.status}</p>
                    <p>Solicitante: {swap.requester.name} {swap.requester.surname} | {swap.requester.email}</p>


                    <ChatBox
                        swapId={swap.swap_id}
                        myWorkerId={swap.shift.worker_id} // el owner del turno actual
                        otherWorkerId={swap.requester_id}
                    />
                </div>
            ))}
            <hr />
            <button onClick={() => navigate('/calendar')}>⬅ Volver al Dashboard</button>
        </div>
    );
};

export default ShiftDetail;
