import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWorkerStats } from '../services/userService';
import { expireOldShifts } from '../services/shiftService';
import { getSwapNotifications } from '../services/swapService';
import { getMyShifts } from '../services/shiftService'; // si ya tienes este servicio
import {
    getMyWorkerProfile,
  } from '../services/workerService';


function Dashboard() {
    const { currentUser, logout, getToken } = useAuth();
    const [stats, setStats] = useState(null);
    const [notifications, setNotifications] = useState({ incomingCount: 0, updatesCount: 0 });
    const [workerId, setWorkerId] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        async function runExpiry() {
            try {
                const token = await getToken();
                await expireOldShifts(token);
                console.log('✔️ Turnos expirados si aplicaba');
            } catch (err) {
                // Error ya se loguea dentro del service
            }
        }

        runExpiry();
    }, [getToken]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const token = await getToken();
                const data = await getWorkerStats(token);
                setStats(data);
            } catch (err) {
                console.error('Error al cargar métricas:', err.message);
            }
        }

        fetchStats();
    }, [getToken]);

    useEffect(() => {
        async function fetchNotifications() {
          try {
            const token = await getToken();
      
            // 1. Obtener mis turnos publicados
            const shifts = await getMyShifts(token);
            console.log('Mis turnos:', shifts);
            const myShiftIds = shifts.map(s => s.shift_id);
            const worker = await getMyWorkerProfile(token);
            setWorkerId(worker.worker_id);
            console.log('IDs de mis turnos:', myShiftIds);
            console.log('ID del trabajador:', workerId);
            // 2. Obtener notificaciones
            const data = await getSwapNotifications(token, workerId, myShiftIds);
            setNotifications(data);
            console.log('Notificaciones:', data);
          } catch (err) {
            console.error('Error al cargar notificaciones:', err.message);
          }
        }
        fetchNotifications();
      }, [getToken, workerId]);
      

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log('Error al cerrar sesión:', error.message);
        }
    };

    if (!currentUser) return <p>No estás autenticado.</p>;
    if (!stats) return <p>Cargando métricas...</p>;

    return (
        <div>
            <h2>👩‍⚕️ Bienvenido al panel</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>📋 Tus turnos</h3>
                    <p>Publicados: <strong>{stats.publishedShifts}</strong></p>
                    <p>Intercambiados: <strong>{stats.swappedShifts}</strong></p>
                </div>

                <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
                    <h3>🔁 Tus intercambios</h3>
                    <p>Propuestos: <strong>{stats.swapsProposed}</strong></p>
                    <p>Aceptados: <strong>{stats.swapsAccepted}</strong></p>
                </div>
            </div>
            <div style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
                <h3>🔔 Notificaciones</h3>

                {notifications.incomingCount > 0 ? (
                    <p>📬 Tienes <strong>{notifications.incomingCount}</strong> propuesta(s) de intercambio que requieren tu revisión.</p>
                ) : (
                    <p>✅ No tienes propuestas pendientes.</p>
                )}

                {notifications.updatesCount > 0 ? (
                    <p>📨 Tienes <strong>{notifications.updatesCount}</strong> intercambio(s) respondido(s).</p>
                ) : (
                    <p>📭 Sin actualizaciones recientes.</p>
                )}
            </div>
            {currentUser ? (
                <div>
                    <p>Usuario logueado: {currentUser.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                    <hr />
                    <button onClick={() => navigate('/profile')}>Editar perfil</button>
                    <hr />
                    <button onClick={() => navigate('/shifts/create')}>📆 Publicar nuevo turno</button>
                    <hr />
                    <button onClick={() => navigate('/shifts/my')}>📋 Ver mis turnos</button>
                    <hr />
                    <button onClick={() => navigate('/shifts/hospital')}>🏥 Ver turnos del hospital</button>
                    <hr />
                    <button onClick={() => navigate('/my-swaps')}>Mis intercambios propuestos</button>
                    <hr />
                    <button onClick={() => navigate('/calendar')}>🗓 Ver mi calendario</button>

                </div>
            ) : (
                <p>No hay usuario logueado</p>
            )}
        </div>
    );
}

export default Dashboard;