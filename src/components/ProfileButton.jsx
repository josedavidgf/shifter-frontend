import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAvatarUrl from '../hooks/useAvatarUrl';

export default function ProfileButton() {
  const navigate = useNavigate();
  const { isWorker } = useAuth();

  const userId = isWorker?.user_id || null;
  const fallbackPicture = isWorker?.user_metadata?.picture || null;
  const avatarUrl = useAvatarUrl(userId, fallbackPicture);

  const initials =
    (isWorker?.name?.[0]?.toUpperCase() || '') +
    (isWorker?.surname?.[0]?.toUpperCase() || '');

  if (!isWorker) return null;

  return (
    <button
      onClick={() => navigate('/profile')}
      className="profile-button"
      aria-label="Perfil"
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="profile-avatar"
          style={{ width: 32, height: 32, borderRadius: '50%' }}
        />
      ) : (
        <span className="profile-initials">{initials || '?'}</span>
      )}
    </button>
  );
}