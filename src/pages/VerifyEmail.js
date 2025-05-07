import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useTrackPageView from '../hooks/useTrackPageView';
import Button from '../components/ui/Button/Button';
import supabase from '../config/supabase';
import { useToast } from '../hooks/useToast';

const VerifyEmail = () => {
  const { pendingEmail } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loadingResend, setLoadingResend] = useState(false);


  useTrackPageView('verify-email');

  const handleResend = async () => {
    const targetEmail = pendingEmail || localStorage.getItem('lastRegisteredEmail');
  
    if (!targetEmail) {
      showError('No se pudo encontrar el email registrado.');
      return;
    }
  
    setLoadingResend(true);
    const redirectTo = process.env.REACT_APP_REDIRECT_URL;
    if (!redirectTo) {
      throw new Error('redirectTo no está definido. Revisa tu .env');
    }
  
    try {
      await supabase.auth.signUp({
        email: targetEmail,
        password: 'dummy-temporal',
        options: { emailRedirectTo: redirectTo }
      });
      showSuccess('Verificación reenviada. Revisa tu correo.');
    } catch (err) {
      console.error('❌ Error reenviando email de verificación:', err.message);
      showError('Error al reenviar la verificación. Intenta de nuevo más tarde.');
    } finally {
      setLoadingResend(false);
    }
  };
  

  return (
    <div className="page page-primary">
      <div className="container">
        <div style={{ padding: '2rem' }}>
          <h2>Verifica tu correo electrónico</h2>
          <p>Para continuar, revisa el email que te hemos enviado y haz clic en el enlace de verificación.</p>
          <p>¿No lo has recibido?</p>
          <p>Si no encuentras el email, revisa tu carpeta de spam o correo no deseado.</p>
          <Button
            label="Reenviar"
            variant="outline"
            size="lg"
            onClick={handleResend}
            disabled={!pendingEmail || loadingResend}
            isLoading={loadingResend}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
