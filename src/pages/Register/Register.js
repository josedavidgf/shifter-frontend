import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useTrackPageView from '../../hooks/useTrackPageView';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import DividerText from '../../components/ui/DividerText/DividerText';

function Register() {
    const { register, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useTrackPageView('register');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(email, password);
            if (response) {
                navigate('/verify-email');
            } else {
                setError('Error en el registro');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    localStorage.setItem('lastRegisteredEmail', email);


    return (
        <div className="container auth-container">
            <div className="auth-content">
                <div className="auth-logo-container">
                    <img src={'assets/logo-tanda-light.png'} alt="Tanda Logo" className="auth-logo" />
                </div>
                <div className="auth-body">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {error && <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>}
                        <InputField
                            name="email"
                            label="Email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                        <InputField
                            name="password"
                            label="Contraseña"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                        />
                        <Button
                            label="Registrarme"
                            variant="primary"
                            size="lg"
                            type="submit"
                            disabled={!email || !password}
                        />
                    </form>

                    <div className="auth-divider">
                        <DividerText text="o" />
                    </div>

                    <Button
                        label="Registro con Google"
                        variant="outline"
                        size="lg"
                        leftIcon={<img src={'assets/google-icon.svg'} alt="Google" width="20" height="20" />}
                        onClick={loginWithGoogle}
                    />
                </div>
            </div>
            <div className="auth-footer">
                <div className="auth-divider">
                    <DividerText text="¿Ya tienes cuenta?" />
                </div>
                <Button
                    label="Iniciar sesión"
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/login')}
                />
            </div>
        </div>
    );
}

export default Register;
