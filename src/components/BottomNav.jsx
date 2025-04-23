import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/calendar">📅 Calendario</NavLink>
      <NavLink to="/my-swaps">🔁 Cambios</NavLink>
      <NavLink to="/shifts/hospital">🔍 Turnos</NavLink>
      <NavLink to="/chats">💬 Mensajes</NavLink>
    </nav>
  );
}
