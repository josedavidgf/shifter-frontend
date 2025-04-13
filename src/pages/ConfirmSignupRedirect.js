import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';
import { checkIfWorkerExists, checkIfWorkerHasHospitalAndSpeciality } from '../services/userService';

const ConfirmSignupRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleRedirect() {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.substring(1));
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
  
      if (!access_token || !refresh_token) {
        console.error('Tokens not found in URL');
        return navigate('/login');
      }
  
      const { error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
  
      if (sessionError) {
        console.error('Error setting session:', sessionError.message);
        return navigate('/login');
      }
  
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error('Error retrieving user from Supabase:', error);
        return navigate('/login');
      }
  
      localStorage.setItem('token', access_token);
      console.log('Usuario autenticado tras verificación:', user);
  
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
