import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useTrackPageView from '../../hooks/useTrackPageView';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import DividerText from '../../components/ui/DividerText/DividerText';
import logoTanda from '../../assets/logo-tanda-light.png';
import logoGoogle from '../../assets/google-icon.svg';
import { useToast } from '../../hooks/useToast';

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();
  const { showError } = useToast();

  useTrackPageView('login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      await login(email, password);
      navigate('/calendar');
    } catch (err) {
      console.error('❌ Login error:', err.message);
      showError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoadingForm(false);
    }
  };

  return (
    <div className="container auth-container">
      <div className="auth-content">
        <div className="auth-logo-container">
          <img src={logoTanda} alt="Tanda Logo" className="auth-logo" />
        </div>

        <div className="auth-body">
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
              isLoading={loadingForm}
              disabled={!email || !password || loadingForm}
            />
          </form>

          <div className="auth-divider">
            <DividerText text="o" />
          </div>

          <Button
            label="Iniciar sesión con Google"
            variant="outline"
            size="lg"
            leftIcon={<img src={logoGoogle} alt="Google" width="20" height="20" />}
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
