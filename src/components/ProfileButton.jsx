import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileButton() {
  const navigate = useNavigate();
  const { isWorker } = useAuth();

  if (!isWorker) return null;

  const initials = isWorker?.name?.[0]?.toUpperCase() + isWorker?.surname?.[0]?.toUpperCase() || '?' ;

  return (
    <button
    onClick={() => navigate('/profile')}
    className="profile-button"
    aria-label="Perfil"
  >
    {initials}
  </button>
  );
}
