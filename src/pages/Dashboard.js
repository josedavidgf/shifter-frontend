import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            alert('Sesión cerrada');
        } catch (error) {
            console.log('Error al cerrar sesión:', error.message);
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
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
                </div>
            ) : (
                <p>No hay usuario logueado</p>
            )}
        </div>
    );
}

export default Dashboard;