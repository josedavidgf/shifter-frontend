import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import useTrackPageView from '../../hooks/useTrackPageView';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import DividerText from '../../components/ui/DividerText/DividerText';
import logoGoogle from '../../assets/google-icon.svg';
import { useToast } from '../../hooks/useToast';
import { mapSupabaseError } from '../../utils/mapSupabaseError';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';



function Login() {
  const { login, loginWithGoogle, setPendingEmail } = useAuth();
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
      console.error('❌ Login error:', err);
      console.error('❌ Login error:', err.message);
      if (err.message === "Email not confirmed") {
        setPendingEmail(email); // esto viene del AuthContext
        navigate("/verify-email");
      } else {
        showError(mapSupabaseError(err));
      }
    } finally {
      setLoadingForm(false);
    }
  };



  const handleBack = () => {
    navigate('/');

  };


  return (
    <>
      <HeaderSecondLevel
        showBackButton
        onBack={handleBack}
      />
      <div className="container auth-container">
        <div className="auth-content">
          <h1>Inicia sesión</h1>

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
          <div className="mt-4">
            <p><Link to='/forgot-password'> ¿Has olvidado tu contraseña?</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
