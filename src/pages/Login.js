import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useTrackPageView from '../hooks/useTrackPageView';
import InputField from '../components/ui/InputField/InputField';


function Login() {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/calendar');  // Redirigir después del login
        } catch (err) {
            setError(err.message);
        }
    };

    useTrackPageView('login');

    return (
        <div className='container'>
            <h2>Iniciar Sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <InputField
                    name="email"
                    label="Correo Electrónico"
                    placeholder="Tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                />
                <InputField
                    name="password"
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                />
                <button className='btn btn-primary' type="submit">Iniciar Sesión</button>
            </form>
            <hr />
            <button className='btn btn-secondary' onClick={loginWithGoogle}>Sign in with Google</button>
        </div>
    );
}

export default Login;
