import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarCheck, Lightning, MagnifyingGlass, ChatCircle } from '../theme/icons';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/calendar" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <CalendarCheck size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>Calendario</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/my-swaps" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <Lightning size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>Cambios</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/shifts/hospital" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <MagnifyingGlass size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>Turnos</span>
          </div>
        )}
      </NavLink>

      <NavLink to="/chats" className="nav-item">
        {({ isActive }) => (
          <div className={`nav-icon ${isActive ? 'active' : ''}`}>
            <ChatCircle size={24} weight={isActive ? 'fill' : 'regular'} />
            <span>Mensajes</span>
          </div>
        )}
      </NavLink>
    </nav>
  );
}
