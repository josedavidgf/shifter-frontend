import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { currentUser, hasCompletedOnboarding } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }
    
    if (!hasCompletedOnboarding && window.location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" />;
    }
    
    if (hasCompletedOnboarding && window.location.pathname === '/onboarding') {
        return <Navigate to="/dashboard" />;
    }
    
    return children;    
};

export default PrivateRoute;
