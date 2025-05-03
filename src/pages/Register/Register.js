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
import { mapSupabaseError } from '../../utils/mapSupabaseError';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';


function Register() {
  const { register, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();
  const { showError, showInfo } = useToast();

  useTrackPageView('register');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    try {
      const { session } = await register(email, password);
      localStorage.setItem('lastRegisteredEmail', email);

      if (session) {
        // Usuario nuevo: sesión creada, mail enviado
        navigate('/verify-email');
      } else {
        // Usuario ya registrado o sin sesión: mensaje neutro
        showInfo(
          "Si tu correo está registrado, te hemos enviado instrucciones para continuar."
        );
      }

    } catch (err) {
      console.error('❌ Register error:', err.message);
      showError(mapSupabaseError(err));
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
        <h2>Crea tu cuenta en Tanda</h2>
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
                label="Registrarme"
                variant="primary"
                size="lg"
                type="submit"
                isLoading={loadingForm}
                leftIcon
                disabled={!email || !password || loadingForm}
              />
            </form>

            <div className="auth-divider">
              <DividerText text="o" />
            </div>

            <Button
              label="Registro con Google"
              variant="outline"
              size="lg"
              leftIcon={<img src={logoGoogle} alt="Google" width="20" height="20" />}
              onClick={loginWithGoogle}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
