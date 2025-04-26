import React from 'react';
import { UserCircle } from '../../../theme/icons';

const HeaderFirstLevel = ({
  title,
  rightAction,
  showIcon = false,
}) => {
  return (
    <header className="header-first">
      <div className="header-first__content">
        <h1 className="header-first__title">{title}</h1>

        {rightAction && (
          <button className="header-first__action" onClick={rightAction.onClick}>
            {rightAction.icon || <UserCircle size={24} />}
          </button>
        )}
      </div>

      {showIcon && <div className="header-first__lightning">&#9889;&#65039;A</div>}

      <div className="header-first__divider"></div>
    </header>
  );
};

export default HeaderFirstLevel;
