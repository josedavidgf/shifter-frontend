import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';

import {
  AddressBook,
  Briefcase,
  Notification,
  Gift,
  MessengerLogo,
  File,
  Books,
  CaretRight,
} from '../../theme/icons';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    {
      label: 'Información personal',
      route: '/profile/personal',
      Icon: AddressBook,
      RightIcon: CaretRight,
    },
    {
      label: 'Ajustes profesionales',
      route: '/profile/work',
      Icon: Briefcase,
      RightIcon: CaretRight,
    },
    {
      label: 'Preferencias de comunicación',
      route: '/profile/preferences',
      Icon: Notification,
      RightIcon: CaretRight,
    },
    {
      label: 'Referir',
      route: '/profile/referral',
      Icon: Gift,
      RightIcon: CaretRight,
    },
    {
      label: 'Contacto',
      route: '/profile/contact',
      Icon: MessengerLogo,
      RightIcon: CaretRight,
    },
    {
      label: 'Términos y condiciones',
      route: '/legal/terms-v1.pdf',
      Icon: File,
      external: true,
      RightIcon: CaretRight,
    },
    {
      label: 'Política de privacidad',
      route: '/legal/privacy-v1.pdf',
      Icon: Books,
      external: true,
      RightIcon: CaretRight,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
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
            {items.map(({ label, route, Icon, RightIcon, external }) => (
              <li
                key={label}
                className="menu-item"
                onClick={() => {
                  if (external) {
                    window.open(route, '_blank', 'noopener,noreferrer');
                  } else {
                    navigate(route);
                  }
                }}
              >
                <div className="menu-item-left">
                  <Icon width={24} height={24} />
                  <span>{label}</span>
                </div>
                {RightIcon && (
                  <RightIcon width={16} height={16} className="menu-item-chevron" />
                )}
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