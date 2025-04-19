import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyShifts, removeShift } from '../services/shiftService';
import { getSpecialities } from '../services/specialityService';
import { getReceivedSwaps, respondToSwap } from '../services/swapService';
import MyShiftsTable from '../components/MyShiftsTable';
import useTrackPageView from '../hooks/useTrackPageView';


const MyShifts = () => {
    const { getToken } = useAuth();
    const [shifts, setShifts] = useState([]);
    const [error, setError] = useState(null);
    const [specialities, setSpecialities] = useState([]);
    const [receivedSwaps, setReceivedSwaps] = useState([]);
    const navigate = useNavigate();

    const getSpecialityName = (id) => {
        const match = specialities.find((s) => s.speciality_id === id);
        return match
            ? `${match.speciality_category} - ${match.speciality_subcategory}`
            : id;
    };

    const loadShifts = useCallback(async () => {
        try {
            const token = await getToken();
            const response = await getMyShifts(token);
            const specs = await getSpecialities(token);
            setShifts(response);
            setSpecialities(specs);
        } catch (err) {
            setError('Error al cargar turnos');
        }
    }, [getToken]);
    const loadSwaps = useCallback(async () => {
        try {
            const token = await getToken();
            const swaps = await getReceivedSwaps(token);
            setReceivedSwaps(swaps);
        } catch (err) {
            setError('Error al cargar swaps');
        }
    }, [getToken]);

    useTrackPageView('my-shifts');


    useEffect(() => {
        loadShifts();
        loadSwaps();
    }, [loadShifts, loadSwaps]);

    const handleDelete = async (shiftId) => {
        if (!window.confirm('¿Seguro que quieres eliminar este turno?')) return;
        try {
            const token = await getToken();
            await removeShift(shiftId, token);
            alert('Turno eliminado');
            loadShifts(); // Recarga lista
        } catch (err) {
            alert('Error al eliminar turno');
            console.error('❌', err.message);
        }
    };

    const handleSwapAction = async (swapId, action) => {
        try {
            const token = await getToken();
            await respondToSwap(swapId, action, token);
            alert(`Intercambio ${action === 'accepted' ? 'aceptado' : 'rechazado'} correctamente`);
            // Recargar los swaps
            const swaps = await getReceivedSwaps(token);
            setReceivedSwaps(swaps);
        } catch (err) {
            alert('Error al actualizar el intercambio: ' + err.message);
        }
    };

    return (
        <div>
            <h2>Mis Turnos Publicados</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* {shifts.length === 0 ? (
                <p>No tienes turnos publicados aún.</p>
            ) : (
                <ul>
                    {shifts
                        .filter((s) => s.state === 'published')
                        .map((shift) => (
                            <li key={shift.shift_id} style={{ marginBottom: '1rem' }}>
                                <strong>{shift.date}</strong> | Tipo: {shift.shift_type} | Etiqueta: {shift.shift_label}<br />
                                Especialidad: {getSpecialityName(shift.speciality_id)}
                                <br />
                                <strong>Preferencias de intercambio:</strong>
                                <ul>
                                    {receivedSwaps
                                        .filter((swap) => swap.shift_id === shift.shift_id)
                                        .map((swap) => (
                                            <div key={swap.swap_id} style={{ border: '1px dashed gray', padding: '0.5rem', marginTop: '0.5rem' }}>
                                                <p>📬 Propuesta recibida:</p>
                                                <p><strong>Fecha ofrecida:</strong> {swap.offered_date || '—'}</p>
                                                <p><strong>Tipo:</strong> {swap.offered_type}</p>
                                                <p><strong>Etiqueta:</strong> {swap.offered_label}</p>
                                                <p><em>Estado:</em> {swap.status}</p>
                                                {swap.status === 'proposed' && (
                                                    <>
                                                        <button onClick={() => handleSwapAction(swap.swap_id, 'accepted')}>✅ Aceptar</button>
                                                        <button onClick={() => handleSwapAction(swap.swap_id, 'rejected')}>❌ Rechazar</button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                </ul>
                                <button onClick={() => navigate(`/shifts/edit/${shift.shift_id}`)}>✏️ Editar</button>
                                <button onClick={() => handleDelete(shift.shift_id)}>🗑 Eliminar</button>
                            </li>
                        ))}
                </ul>
            )} */}
            {shifts.length === 0 ? (
                <p>No tienes turnos publicados aún.</p>
            ) : (
                <MyShiftsTable
                    shifts={shifts}
                    getSpecialityName={getSpecialityName}
                    receivedSwaps={receivedSwaps}
                    handleSwapAction={handleSwapAction}
                    handleDelete={handleDelete}
                    navigate={navigate}
                />
            )}
            <hr />
            <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
        </div>
    );
};

export default MyShifts;

// revision