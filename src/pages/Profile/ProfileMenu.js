import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import { AddressBook, Briefcase, Notification, Gift, MessengerLogo, File, Books } from '../../theme/icons';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario



const ProfileMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { label: 'Información personal', route: '/profile/personal', Icon: AddressBook },
    { label: 'Ajustes profesionales', route: '/profile/work', Icon: Briefcase },
    { label: 'Preferencias de comunicación', route: '/profile/preferences', Icon: Notification },
    { label: 'Referir', route: '/profile/referral', Icon: Gift },
    { label: 'Contacto', route: '/profile/contact', Icon: MessengerLogo },
    { label: 'Términos y condiciones', route: 'https://tanda-app/legal/terms', Icon: File, external: true },
    { label: 'Política de privacidad', route: 'https://tanda-app/legal/privacy', Icon: Books, external: true },
  ];
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // <--- AÑADE ESTO
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
      <div className="page page-secondary">
        <div className="container">

          <ul className="menu-list">
            {items.map(({ label, route, Icon }) => (
              <li key={label} className="menu-item" onClick={() => navigate(route)}>
                <div className="menu-item-left">
                  <Icon width={24} height={24} />
                  <span>{label}</span>
                </div>
                <span className="menu-item-chevron">{'›'}</span>
              </li>
            ))}
          </ul>
          <div className="logout-button-wrapper mt-8">
            <Button
              label="Cerrar sesión"
              variant="danger"
              size="lg"
              onClick={handleLogout}
              />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileMenu;
