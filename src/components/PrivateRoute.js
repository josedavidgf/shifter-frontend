import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLoader from './ui/AppLoader';

const PrivateRoute = ({ children }) => {
  const { currentUser, isWorker, authReady } = useAuth();

  if (!authReady) return <AppLoader />;

  if (!currentUser) return <Navigate to="/login" />;

  // Si no tiene email confirmado (para login tradicional)
  if (!currentUser.email_confirmed_at && !currentUser.confirmed_at && !currentUser.email_confirmed) {
    return <Navigate to="/verify-email" />;
  }

  // Si aún no tiene worker creado
  if (!isWorker) return <Navigate to="/onboarding/code" />;

  return children;
};

export default PrivateRoute;
