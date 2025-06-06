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
import supabase from '../../config/supabase';
import { trackEvent } from '../../hooks/useTrackPageView';
import { EVENTS } from '../../utils/amplitudeEvents';


function Login() {
  const { login, loginWithGoogle, setPendingEmail, isWorker, refreshWorkerProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();
  const { showError } = useToast();

  useTrackPageView('login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    trackEvent(EVENTS.LOGIN_ATTEMPTED_WITH_EMAIL, { email });
    try {
      const { data } = await login(email, password);
      console.log('[Login] Login completo. Redirigiendo...');
      trackEvent(EVENTS.LOGIN_SUCCESS, { email });
    } catch (err) {
      trackEvent(EVENTS.LOGIN_FAILED, {
        email,
        error: err.message,
      });
      if (err.message === "Email not confirmed") {
        setPendingEmail(email);
        localStorage.setItem('lastRegisteredEmail', email);

        const redirectTo = process.env.REACT_APP_REDIRECT_URL;

        if (!redirectTo) {
          throw new Error('redirectTo no está definido. Revisa tu .env');
        }

        try {
          await supabase.auth.signUp({
            email,
            password: 'dummy-temporal',
            options: { emailRedirectTo: redirectTo },
          });
        } catch (err) {
          console.warn('❌ Error al reenviar email desde login:', err.message);
        }

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
              onClick={() => {
                trackEvent(EVENTS.LOGIN_ATTEMPTED_WITH_GOOGLE);
                loginWithGoogle();
              }}
            />
          </div>
          <div className="mt-4">
            <p><Link
              to='/forgot-password'
              onClick={() => trackEvent(EVENTS.FORGOT_PASSWORD_CLICKED)}
            >
              ¿Has olvidado tu contraseña?
            </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
