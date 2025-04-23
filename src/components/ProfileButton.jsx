import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProfileButton() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const initials = currentUser?.email?.[0]?.toUpperCase() || '?';

  return (
    <button
      onClick={() => navigate('/profile')}
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: '#eee',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer',
      }}
      aria-label="Perfil"
    >
      {initials}
    </button>
  );
}
