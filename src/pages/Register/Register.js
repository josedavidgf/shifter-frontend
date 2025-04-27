import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import useTrackPageView from '../../hooks/useTrackPageView';
import InputField from '../../components/ui/InputField/InputField';


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
        <div className="page page-primary">
        <div className='container' >
            <h2>Registro</h2>
            <p>Por favor, completa el formulario para registrarte.</p>
            <p>Recibirás un correo de confirmación una vez que tu cuenta esté activa.</p>
            <p>Si ya tienes una cuenta, puedes iniciar sesión <a href="/login">aquí</a>.</p>
            <form onSubmit={handleSubmit}>
                <InputField
                    name="email"
                    label="Correo Electrónico"
                    placeholder="Tu correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    maxLength={50}
                    showCharacterCount={true}
                    helperText="Por favor, introduce un correo electrónico válido."
                    errorText={email && !/\S+@\S+\.\S+/.test(email) ? 'Correo electrónico inválido' : ''}
                />
                <InputField
                    name="password"
                    label="Contraseña"
                    placeholder="Tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    required
                    maxLength={20}
                    showCharacterCount={true}
                    helperText="La contraseña debe tener al menos 6 caracteres."
                    errorText={password && password.length < 6 ? 'La contraseña es demasiado corta' : ''}
                />
                <button className='btn btn-primary' type="submit">Registrarse</button>
            </form>
        </div >
        </div>
    );
};

export default Register;
