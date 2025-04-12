import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWorkerStats } from '../services/userService';
import { expireOldShifts } from '../services/shiftService';


function Dashboard() {
    const { currentUser, logout, getToken } = useAuth();
    const [stats, setStats] = useState(null);

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

    const handleLogout = async () => {
        try {
            await logout();
            alert('Sesión cerrada');
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
                    <button onClick={() => navigate('/my-swaps')}>Mis intercambios</button>
                </div>
            ) : (
                <p>No hay usuario logueado</p>
            )}
        </div>
    );
}

export default Dashboard;