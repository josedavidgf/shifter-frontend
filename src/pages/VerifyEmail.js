import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { resendVerificationEmail } from '../services/authService';

const VerifyEmail = () => {
  const { getToken } = useAuth();
  const [status, setStatus] = useState('');

  const handleResend = async () => {
    try {
      const token = await getToken();
      await resendVerificationEmail(token);
      setStatus('✅ Verificación reenviada. Revisa tu correo.');
    } catch (err) {
      setStatus('❌ No se pudo reenviar la verificación.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Verifica tu correo electrónico</h2>
      <p>Para continuar, revisa el email que te hemos enviado y haz clic en el enlace de verificación.</p>
      <p>¿No lo has recibido?</p>

      <button onClick={handleResend}>Reenviar email de verificación</button>
      {status && <p style={{ marginTop: '1rem' }}>{status}</p>}
    </div>
  );
};

export default VerifyEmail;
