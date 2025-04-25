import React from 'react';
import useAvatarUrl from '../hooks/useAvatarUrl';
import useUserInitials from '../hooks/useUserInitials';

const Avatar = ({ user, size = 32, className = '' }) => {
  const avatarUrl = useAvatarUrl(user?.user_id, user?.user_metadata?.picture);
  const initials = useUserInitials(user);

  return (
    <div
      className={`avatar-wrapper ${className}`}
      style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden' }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          className="avatar-initials"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ccc',
            fontSize: size * 0.4,
            fontWeight: 'bold',
            color: '#fff',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;