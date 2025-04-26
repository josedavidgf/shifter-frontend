import React from 'react';
import { ArrowLeft } from '../../../theme/icons';

const HeaderSecondLevel = ({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  theme = 'light',
  showIcon = false,
}) => {
  return (
    <header className={`header-second-level ${theme === 'dark' ? 'header-second-level--dark' : 'header-second-level--light'}`}>
      <div className="header-second-level__content">
        <div className="header-second-level__side header-second-level__side--left">
          {showBackButton && (
            <button className="header-second-level__back" onClick={onBack}>
              <ArrowLeft size={20} weight="bold" className="header-second-level__back-icon" />
              <span className="header-second-level__back-label">Atrás</span>
            </button>
          )}
        </div>

        <h1 className="header-second-level__title">{title}</h1>

        <div className="header-second-level__side header-second-level__side--right">
          {rightAction && (
            <button className="header-second-level__action" onClick={rightAction.onClick}>
              {rightAction.icon && <span className="header-second-level__action-icon">{rightAction.icon}</span>}
              {rightAction.label}
            </button>
          )}
        </div>
      </div>

      {showIcon && <div className="header-second-level__lightning">&#9889;&#65039;A</div>}

      <div className="header-second-level__divider"></div>
    </header>
  );
};

export default HeaderSecondLevel;
