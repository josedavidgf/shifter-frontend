import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkerApi } from '../../api/useWorkerApi';
import { useAuth } from '../../context/AuthContext';

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { completeOnboarding, loading, error } = useWorkerApi(); // 🆕


  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken(); // 💥 Aquí obtienes el token
        await completeOnboarding(token); // ✅ Ahora puedes completar el onboarding
        // Redirige después de completar
        setTimeout(() => {
          navigate('/calendar');
        }, 2000);
      } catch (err) {
        console.error('Error completando el onboarding:', err.message);
      }
    };

    completeAndRedirect();
  }, [navigate, getToken]);

  return (
    <div>
      <h2>Onboarding completado!</h2>
      <p>Redirigiendo a tu panel de control...</p>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Si no eres redirigido automáticamente, haz clic <a href="/calendar">aquí</a>.</p>
      <p>Si tienes problemas, por favor contacta con soporte.</p>
      <p>Gracias por unirte a nosotros!</p>
    </div>
  );
}
