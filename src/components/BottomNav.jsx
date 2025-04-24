import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDots, Lightning, MagnifyingGlass, ChatCircle } from '@/theme';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/calendar" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <CalendarDots size={12} />
            <span>Calendario</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/my-swaps" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <Lightning size={12} />
            <span>Cambios</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/shifts/hospital" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <MagnifyingGlass size={12} />
            <span>Turnos</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/chats" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <ChatCircle size={12} />
            <span>Mensajes</span>
          </div>
        )}
      </NavLink>
    </nav>
  );
}
