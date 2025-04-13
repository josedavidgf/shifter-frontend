import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { checkIfWorkerExists, checkIfWorkerHasHospitalAndSpeciality } from '../services/userService';

const ConfirmSignupRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleRedirect() {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1)); // elimina "#"
      const access_token = params.get('access_token');

      if (!access_token) {
        console.error('No token found in URL');
        return navigate('/login');
      }

      const { data: { user }, error } = await supabase.auth.getUser(access_token);
      if (error || !user) {
        console.error('Error retrieving user from token');
        return navigate('/login');
      }

      localStorage.setItem('token', access_token);
      console.log('✅ Usuario autenticado tras verificación:', user);

      // verificar si es worker y ha completado onboarding
      const isWorker = await checkIfWorkerExists(access_token);
      const hasOnboarding = isWorker && await checkIfWorkerHasHospitalAndSpeciality(access_token);

      if (!isWorker) {
        return navigate('/onboarding');
      } else if (!hasOnboarding) {
        return navigate('/onboarding/step-2');
      } else {
        return navigate('/dashboard');
      }
    }

    handleRedirect();
  }, [navigate]);

  return <p>Confirmando tu cuenta...</p>;
};

export default ConfirmSignupRedirect;
