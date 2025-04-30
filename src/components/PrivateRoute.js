import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from './ui/AppLoader';



const PrivateRoute = ({ children }) => {
  const { currentUser, isWorker, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <AppLoader />;
  } 

  if (!currentUser) return <Navigate to="/login" />;

  if (!currentUser.email_confirmed_at) {
    return <Navigate to="/verify-email" />;
  }

  // Si no tiene worker creado todavía
  if (!isWorker) {
    if (location.pathname.startsWith('/onboarding')) return children;
    return <Navigate to="/onboarding/code" />;
  }

  // Aquí empieza el flujo de pasos de onboarding basados en datos reales
  if (!isWorker.worker_type_id) {
    if (location.pathname !== '/onboarding/code') return <Navigate to="/onboarding/code" />;
    return children;
  }

  if (!isWorker.workers_specialities || isWorker.workers_specialities.length === 0) {
    if (location.pathname !== '/onboarding/speciality') return <Navigate to="/onboarding/speciality" />;
    return children;
  }

  if (!isWorker.name || !isWorker.surname) {
    if (location.pathname !== '/onboarding/name') return <Navigate to="/onboarding/name" />;
    return children;
  }

  // (Teléfono opcional) — podrías poner aquí control extra si quieres forzarlo
  if (!isWorker.mobile_phone || !isWorker.mobile_country_code) {
    if (location.pathname !== '/onboarding/phone') return <Navigate to="/onboarding/phone" />;
    return children;
  }

  // Si ha completado todo, ya puede entrar al calendar
  if (isWorker.onboarding_completed) {
    if (location.pathname.startsWith('/onboarding')) return <Navigate to="/calendar" />;
    return children;
  }

  // Cualquier otro caso que no contemplemos, lo mandamos a Calendar como fallback
  return children;
};

export default PrivateRoute;
