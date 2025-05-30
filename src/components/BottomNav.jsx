import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarCheck, Lightning, MagnifyingGlass, ChatCircle } from '../theme/icons';
import { useSwapNotifications } from '../hooks/useSwapNotifications';
import { useUnreadMessages } from '../hooks/useUnreadMessages'; // nuevo hook
import { trackEvent } from '../hooks/useTrackPageView'; // Importamos trackEvent
import { EVENTS } from '../utils/amplitudeEvents'; // Importamos los eventos

export default function BottomNav() {
  const { hasPendingSwaps } = useSwapNotifications();
  const { hasUnreadMessages } = useUnreadMessages(); // nuevo hook

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/calendar"
        className="nav-item"
        onClick={() => trackEvent(EVENTS.CALENDAR_ICON_CLICKED)} // Trackeamos clic en "Calendario"
      >
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>Calendario</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/shifts/hospital"
        className="nav-item"
        onClick={() => trackEvent(EVENTS.SHIFTS_ICON_CLICKED)} // Trackeamos clic en "Turnos"
      >
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <MagnifyingGlass size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>Turnos</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/my-swaps"
        className="nav-item"
        onClick={() => trackEvent(EVENTS.SWAPS_ICON_CLICKED)} // Trackeamos clic en "Cambios"
      >
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <div className="notification-dot-wrapper">
              <Lightning size={24} weight={isActive ? 'fill' : 'regular'} />
              {hasPendingSwaps && <span className="notification-dot" />}
            </div>
            <span>Cambios</span>
          </div>
        )}
      </NavLink>

      <NavLink
        to="/chats"
        className="nav-item"
        onClick={() => trackEvent(EVENTS.MESSAGES_ICON_CLICKED)} // Trackeamos clic en "Mensajes"
      >
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <div className="notification-dot-wrapper">
              <ChatCircle size={24} weight={isActive ? 'fill' : 'regular'} />
              {hasUnreadMessages && <span className="notification-dot" />}
            </div>
            <span>Mensajes</span>
          </div>
        )}
      </NavLink>
    </nav>
  );
}
