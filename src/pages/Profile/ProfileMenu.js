import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { label: 'Información personal', route: '/profile/personal', icon: '👤' },
    { label: 'Ajustes profesionales', route: '/profile/work', icon: '🏥' },
    { label: 'Preferencias de comunicación', route: '/preferences', icon: '📩' },
    { label: 'Referir', route: '/profile/referral', icon: '🎁' },
    { label: 'Contacto', route: '/profile/contact', icon: '📣' },
    { label: 'Términos y condiciones', route: 'https://tanda-app/legal/terms', icon: '📄', external: true },
    { label: 'Política de privacidad', route: 'https://tanda-app/legal/privacy', icon: '🔒', external: true },
  ];
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  return (
    <>
      <HeaderSecondLevel
        title="Perfil"
        showBackButton
        onBack={handleBack}
      />
      <div className="container page">

        <ul className="profile-menu">
          {items.map(({ label, route, icon, external }) => (
            <li key={route} className="profile-menu-item" onClick={() => {
              external ? window.open(route, '_blank') : navigate(route);
            }}>
              <span className="icon">{icon}</span>
              <span className="label">{label}</span>
              <span className="chevron">›</span>
            </li>
          ))}
        </ul>
        <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </>
  );
};

export default ProfileMenu;
