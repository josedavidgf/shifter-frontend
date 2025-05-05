import React from 'react';
import { format } from 'date-fns';
import { CalendarCheck } from '../theme/icons';
import EmptyState from '../components/ui/EmptyState/EmptyState';

const EVENT_ICONS = {
  shift_published: <CalendarCheck size={20} />,
  swap_proposed: <CalendarCheck size={20} />, //pending to define
  swap_received: <CalendarCheck size={20} />,
  swap_accepted: <CalendarCheck size={20} />,
  swap_rejected: <CalendarCheck size={20} />,
  chat_opened: <CalendarCheck size={20} />,
};

const EVENT_TITLES = {
  shift_published: 'Turno publicado',
  swap_proposed: 'Propuesta enviada',
  swap_received: 'Has recibido una propuesta',
  swap_accepted: 'Intercambio aceptado',
  swap_rejected: 'Intercambio rechazado',
  chat_opened: 'Chat disponible',
};

const ActivityTable = ({ events }) => {
  if (events.length === 0) {
    return (
      <EmptyState
        title="Sin actividad todavía"
        description="Aquí verás eventos cuando publiques turnos o propongas/recibas intercambios."
      />
    );
  }

  return (
    <div className="activity-list">
      {events.map((event) => {
        const icon = EVENT_ICONS[event.type] || <CalendarCheck size={20} />;
        const title = EVENT_TITLES[event.type] || event.type;
        const dateStr = format(new Date(event.created_at), 'dd/MM/yyyy HH:mm');

        return (
          <div key={event.id} className="activity-card">
            <div className="activity-icon">{icon}</div>
            <div className="activity-details">
              <strong>{title}</strong>
              <p className="activity-date">{dateStr}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTable;
