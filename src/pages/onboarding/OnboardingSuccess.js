import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeOnboarding } from '../../services/workerService'; // <- Importa correctamente
import { useAuth } from '../../context/AuthContext';

export default function OnboardingSuccess() {
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    const completeAndRedirect = async () => {
      try {
        const token = await getToken(); // 💥 Aquí obtienes el token
        console.log('Token:', token);
        await completeOnboarding(token); // ✅ Ahora puedes completar el onboarding
        // Redirige después de completar
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        console.error('Error completando el onboarding:', err.message);
      }
    };

    completeAndRedirect();
  }, [navigate, getToken]);

  return (
    <div>
      <h2>✅ Onboarding completado!</h2>
      <p>Redirigiendo a tu panel de control...</p>
    </div>
  );
}
