import React from 'react';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import { USER_EVENT_CONFIG } from '../utils/userEvents';
import { useNavigate } from 'react-router-dom';
import ActivityCardContent from '../components/ui/Cards/ActivityCardContent';

const ActivityTable = ({ events }) => {
  const navigate = useNavigate();

  if (events.length === 0) {
    return (
      <EmptyState
        title="Sin actividad todavía"
        description="Aquí verás eventos cuando publiques turnos o propongas/recibas intercambios."
        ctaLabel="Ir al calendario"
        onCtaClick={() => navigate('/calendar')}
      />
    );
  }

  return (
    <div className="activity-list">
      {events.map((event) => {
      const config = USER_EVENT_CONFIG[event.type] || {};
      const icon = config.icon;
      const title = config.title || event.type;
      const description = config.getDescription?.(event.metadata) || '';
      const hasUnread = !event.seen;

      return (
        <div
          key={event.id}
          className="card-base"
          style={{ position: 'relative' }}
        >
          {hasUnread && <span className="card-notification-dot" />}
          <ActivityCardContent
            icon={icon}
            title={title}
            description={description}
            date={event.created_at}
          />
        </div>
      );
    })}

    </div>
  );
};

export default ActivityTable;
