import React from 'react';
import { UserCircle } from '../../../theme/icons';

const HeaderFirstLevel = ({
  title,
  rightAction,
  rightActions,
  showIcon = false,
}) => {
  return (
    <header className="header-first">
      <div className="header-first__content">
        <h2 className="header-first__title">{title}</h2>

        {rightActions ? (
          <div className="header-first__actions-group">
            {rightActions.map((action, index) => (
              <button
                key={index}
                className="header-first__action"
                onClick={action.onClick}
              >
                {action.icon}
              </button>
            ))}
          </div>
        ) : (
          rightAction && (
            <button className="header-first__action" onClick={rightAction.onClick}>
              {rightAction.icon || <UserCircle size={24} />}
            </button>
          )
        )}
      </div>

      {showIcon && <div className="header-first__lightning">&#9889;&#65039;A</div>}

      <div className="header-first__divider"></div>
    </header>
  );
};

export default HeaderFirstLevel;
