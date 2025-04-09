import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { currentUser, hasCompletedOnboarding } = useAuth();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" />;

  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
