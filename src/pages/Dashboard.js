import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { currentUser, logout } = useAuth();

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
                </div>
            ) : (
                <p>No hay usuario logueado</p>
            )}
        </div>
    );
}

export default Dashboard;