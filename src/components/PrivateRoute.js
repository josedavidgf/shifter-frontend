import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, isWorker, hasCompletedOnboarding, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // 👈 evita render hasta que esté todo cargado


  if (!currentUser) return <Navigate to="/login" />;

  // No ha hecho el onboarding step 1
  if (!isWorker && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // Es worker pero no ha completado el step 2
  if (isWorker && !hasCompletedOnboarding && location.pathname !== '/onboarding/step-2') {
    return <Navigate to="/onboarding/step-2" />;
  }

  // No debe acceder a pasos anteriores si ya ha completado todo
  if (hasCompletedOnboarding && ['/onboarding', '/onboarding/step-2'].includes(location.pathname)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
