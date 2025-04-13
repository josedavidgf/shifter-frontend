import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../config/supabase';

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(() => navigate('/dashboard'))
        .catch(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <p>Estableciendo sesión...</p>;
}

export default AuthCallback;
