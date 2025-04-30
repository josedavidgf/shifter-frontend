import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useTrackPageView from '../hooks/useTrackPageView';
import Button from '../components/ui/Button/Button';
import supabase from '../config/supabase';
import { useToast } from '../hooks/useToast';



const VerifyEmail = () => {
  const { pendingEmail } = useAuth();
  const [status, setStatus] = useState('');
  const { showSuccess, showError } = useToast();


  useTrackPageView('verify-email');

  const handleResend = async () => {
    if (!pendingEmail) {
      setStatus('❌ No se pudo encontrar el email registrado.');
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      });
      if (error) throw error;
      showSuccess('Verificación reenviada. Revisa tu correo');
    } catch (err) {
      console.error(err);
      showError('Error al reenviar la verificación. Intenta de nuevo más tarde.');
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
            disabled={!pendingEmail}
          />
          {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
