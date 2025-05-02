import React from 'react';
import { ArrowLeft } from '../../../theme/icons';

const HeaderSecondLevel = ({
  title,
  showBackButton = false,
  onBack,
  rightAction,
  theme = 'light',
}) => {
  return (
    <header
      className={`header-second-level ${theme === 'dark'
        ? 'header-second-level--dark'
        : 'header-second-level--light'
        }`}
    >
      <div className="header-second-level__content">
        <div className="header-second-level__side header-second-level__side--left">
          {showBackButton && (
            <button
              className="header-second-level__back"
              onClick={onBack}
              aria-label="Volver"
            >
              <ArrowLeft size={20} weight="bold" className="header-second-level__back-icon" />
              <span className="header-second-level__back-label">Atrás</span>
            </button>
          )}
        </div>

        <h1 className="header-second-level__title">{title}</h1>

        <div className="header-second-level__side header-second-level__side--right">
          {rightAction && (
            <button
              className="header-second-level__action"
              onClick={rightAction.onClick}
              aria-label={rightAction.label}
            >
              {rightAction.label}
              {rightAction.icon && (
                <span className="header-second-level__action-icon">
                  {rightAction.icon}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="header-second-level__divider"></div>
    </header>
  );
};

export default HeaderSecondLevel;
