import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AppLoader from '../ui/AppLoader';
import App from '../../App';


const AppWrapper = () => {
  const { loading } = useAuth();

  if (loading) return <AppLoader />;

  return <App />;
};

export default AppWrapper;
