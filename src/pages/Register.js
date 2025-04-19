import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useTrackPageView from '../hooks/useTrackPageView';

const Register = () => {
    const { register } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useTrackPageView('register');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(email, password);
            if (response) {
                alert('Registro exitoso');
            } else {
                alert('Error en el registro');
            }
        } catch (error) {
            console.error('Error en el registro:', error.message);
            alert('Error al registrar el usuario');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Register;
