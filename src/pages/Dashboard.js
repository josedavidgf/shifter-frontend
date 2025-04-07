import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';

function Dashboard() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getUserProfile();
                setProfile(data.user);
            } catch (err) {
                console.error('Error al obtener el perfil:', err.message);
            }
        }
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        alert('Sesión cerrada');
        window.location.href = '/login';
    };

    return (
        <div>
            <h2>Dashboard</h2>
            {profile ? (
                <p>Bienvenido, {profile.email}</p>
            ) : (
                <p>Cargando perfil...</p>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
