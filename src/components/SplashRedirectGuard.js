// src/components/SplashRedirectGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './ui/Loader/Loader';
import { getPendingOnboardingStep } from './PrivateRoute';

export default function SplashRedirectGuard() {
  const { currentUser, isWorker, authReady } = useAuth();
  console.log('authReady',authReady);
  console.log('isWorker',isWorker);

  if (!authReady || !isWorker) {
    console.log('Cargando Splash')
    return <Loader text="Cargando Tanda..." minTime={800} />;
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
  console.log('pendingStep',pendingStep)

  if (pendingStep) {
    return <Navigate to={pendingStep} replace />;
  }

  return <Navigate to="/calendar" replace />;
}
