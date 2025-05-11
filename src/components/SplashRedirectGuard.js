// src/components/SplashRedirectGuard.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader/Loader';
import { getPendingOnboardingStep } from './PrivateRoute';
import { useToast } from '../hooks/useToast';
import { reportError } from '../lib/sentry';



export default function SplashRedirectGuard() {
  const { currentUser, isWorker, authReady, logout } = useAuth();
  const [forceLogout, setForceLogout] = useState(false);
  const { showError } = useToast();


  console.log('authReady', authReady);
  console.log('isWorker', isWorker);

  // ⏱ Timeout defensivo si Splash se queda bloqueada
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!authReady || isWorker === null) {
        console.warn('[SplashGuard] Timeout. Logout preventivo.');
        // 🔥 Reportamos a Sentry
        reportError(new Error('Splash timeout: logout preventivo'), {
          source: 'SplashRedirectGuard',
          currentUser,
          authReady,
          isWorker,
        });
        showError('Hubo un problema cargando tu cuenta. Vuelve a iniciar sesión.');
        setForceLogout(true);
        logout(); // 👈 cerramos sesión
      }
    }, 9000); // 9 segundos

    return () => clearTimeout(timeout);
  }, [authReady, isWorker]);

  if (forceLogout) return <Navigate to="/login" replace />;


  if (!authReady || !isWorker) {
    console.log('Cargando Splash')
    return <Loader text="Cargando Tanda..." minTime={50} />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (
    !currentUser.email_confirmed_at &&
    !currentUser.confirmed_at &&
    !currentUser.email_confirmed
  ) {
    return <Navigate to="/verify-email" replace />;
  }
  console.log('aqui')
  const pendingStep = getPendingOnboardingStep(isWorker);
  console.log('pendingStep', pendingStep)

  if (pendingStep) {
    return <Navigate to={pendingStep} replace />;
  }

  return <Navigate to="/calendar" replace />;
}
