import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiCalendar, FiRepeat, FiSearch, FiMessageCircle } from 'react-icons/fi';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/calendar" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <FiCalendar size={12} />
            <span>Calendario</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/my-swaps" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <FiRepeat size={12} />
            <span>Cambios</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/shifts/hospital" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <FiSearch size={12} />
            <span>Turnos</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/chats" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <FiMessageCircle size={12} />
            <span>Mensajes</span>
          </div>
        )}
      </NavLink>
    </nav>
  );
}
