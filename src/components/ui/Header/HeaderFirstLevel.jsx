import { useNavigate } from 'react-router-dom';
import React from 'react';
import { UserCircle, Timer, Watch, Clock, ChartBar, ChartPie, ChatCircleDots, ChartPieSlice, ChartBarHorizontal, ChartLine } from '../../../theme/icons';

const HeaderFirstLevel = ({
  title,
  rightAction,
  rightActions,
  showIcon = false,
}) => {
  const navigate = useNavigate();

  return (
    <header className="header-first">
      <div className="header-first__content">
        <h2 className="header-first__title">{title}</h2>

        {rightActions ? (
          <div className="header-first__actions-group">
            <button
              className="header-first__action"
              onClick={() => navigate('/stats')}
            >
              <ChartBar size={28} />
            </button>
            {rightActions.map((action, index) => (
              <button
                key={index}
                className="header-first__action"
                onClick={action.onClick}
              >
                {React.cloneElement(action.icon, { size: 32 })}
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
