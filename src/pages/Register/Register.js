import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import useTrackPageView from '../../hooks/useTrackPageView';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import DividerText from '../../components/ui/DividerText/DividerText';
import logoGoogle from '../../assets/google-icon.svg';
import { useToast } from '../../hooks/useToast';
import { mapSupabaseError } from '../../utils/mapSupabaseError';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import supabase from '../../config/supabase';


function Register() {
  const { register, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();
  const { showError, showInfo, showSuccess } = useToast();

  useTrackPageView('register');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loadingForm) return;
    setLoadingForm(true);
  
    const redirectTo = process.env.REACT_APP_REDIRECT_URL;
    if (!redirectTo) {
      showError('Error interno de configuración. Intenta más tarde.');
      return;
    }
  
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: redirectTo },
      });
  
      // 🧠 Guardamos el último email por UX
      localStorage.setItem('lastRegisteredEmail', email);
  
      if (error) {
        // 💡 Usuario ya registrado pero no confirmado
        if (error.message.toLowerCase().includes('user already registered')) {
          const { data: resend, error: resendError } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectTo },
          });
  
          if (resendError) {
            throw resendError;
          }
  
          showSuccess('Este correo ya estaba registrado. Te hemos reenviado el email de verificación.');
          return navigate('/verify-email');
        }
  
        throw error;
      }
  
      showSuccess('Cuenta creada correctamente. Revisa tu correo para confirmar.');
      return navigate('/verify-email');
  
    } catch (err) {
      console.error('❌ Register error:', err.message);
      if (err.message === 'rate_limit_exceeded') {
        showError('Has solicitado demasiados registros seguidos. Intenta de nuevo en unos minutos.');
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
          <h1>Crea tu cuenta</h1>
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
