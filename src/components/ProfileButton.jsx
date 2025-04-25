import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

export default function ProfileButton() {
  const navigate = useNavigate();
  const { isWorker } = useAuth();

  if (!isWorker) return null;

  return (
    <button
      onClick={() => navigate('/profile')}
      className="profile-button"
      aria-label="Perfil"
    >
      <Avatar user={isWorker} size={32} />
    </button>
  );
}