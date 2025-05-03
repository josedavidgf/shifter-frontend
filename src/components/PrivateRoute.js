import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from './ui/AppLoader';
import { useLocation } from 'react-router-dom';


// 🔁 Función auxiliar para detectar paso pendiente del onboarding
function getPendingOnboardingStep(worker) {
  if (!worker) return '/onboarding/code';

  if (!worker.worker_type_id) {
    console.log('👀 PrivateRoute redirigiendo a onboarding');
    return '/onboarding/code';
  }

  if (!worker.workers_specialities || worker.workers_specialities.length === 0)
    return '/onboarding/speciality';

  if (!worker.name || !worker.surname) return '/onboarding/name';

  if (!worker.mobile_phone || !worker.mobile_country_code)
    return '/onboarding/phone';

  if (!worker.onboarding_completed) return '/onboarding/code';

  return null; // ✅ Todo completado
}

const PrivateRoute = ({ children }) => {
  const { currentUser, isWorker, authReady } = useAuth();
  const location = useLocation();


  if (!authReady || isWorker === null) {
    return <AppLoader />;
  }
  if (!currentUser) return <Navigate to="/login" />;

  if (
    !currentUser.email_confirmed_at &&
    !currentUser.confirmed_at &&
    !currentUser.email_confirmed
  ) {
    return <Navigate to="/verify-email" />;
  }

  // 🧭 EXCEPCIÓN: estamos en /onboarding/confirm y venimos con datos en location.state
  if (
    location.pathname === '/onboarding/success'
  ) {
    return children;
  }

  // 🧭 EXCEPCIÓN: estamos en /onboarding/confirm y venimos con datos en location.state
  if (
    location.pathname === '/onboarding/confirm' &&
    location.state?.worker_type_id &&
    location.state?.hospital_id
  ) {
    return children;
  }
  const hashParams = new URLSearchParams(window.location.hash.slice(1));
  const type = hashParams.get('type');
  const isResetPasswordFlow =
    location.pathname === '/reset-password' || type === 'reset_password';

  // ✅ Si hay onboarding pendiente, redirige al paso correspondiente
  const pendingStep = getPendingOnboardingStep(isWorker);


  if (
    pendingStep &&
    location.pathname !== pendingStep &&
    !location.pathname.startsWith(pendingStep) &&
    !isResetPasswordFlow
  ) {
    return <Navigate to={pendingStep} />;
  }





  return children;
};

export default PrivateRoute;
