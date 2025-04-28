import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useTrackPageView from '../../hooks/useTrackPageView';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import DividerText from '../../components/ui/DividerText/DividerText';

function Login() {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useTrackPageView('login');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/calendar');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container auth-container">
            <div className="auth-content">
                <div className="auth-logo-container">
                    <img src={'/assets/logo-tanda-light.png'} alt="Tanda Logo" className="auth-logo" />
                </div>

                <div className="auth-body">
                    {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}
                    <form className="auth-form" onSubmit={handleSubmit}>
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
                            label="Iniciar sesión"
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
                        label="Iniciar sesión con Google"
                        variant="outline"
                        size="lg"
                        leftIcon={<img src={'/assets/google-icon.svg'} alt="Google" width="20" height="20" />}
                        onClick={loginWithGoogle}
                    />
                </div>
            </div>

            <div className="auth-footer">
                <div className="auth-divider">
                    <DividerText text="¿Aún no tienes cuenta?" />
                </div>

                <Button
                    label="Registrarme"
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/register')}
                />
            </div>
        </div>
    );
}

export default Login;
