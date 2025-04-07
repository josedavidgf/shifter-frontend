import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            alert('Sesión cerrada');
            navigate('/login');  // Redirigir al login después de cerrar sesión
        } catch (error) {
            console.log('Error al cerrar sesión:', error.message);
        }
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {currentUser ? (
                    <>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
