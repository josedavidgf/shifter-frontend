import React from 'react';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import { USER_EVENT_CONFIG } from '../utils/userEvents';
import { formatFriendlyDate } from '../utils/formatFriendlyDate';

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
        const config = USER_EVENT_CONFIG[event.type] || {};
        const icon = config.icon;
        const title = config.title || event.type;
        const description = config.getDescription?.(event.metadata) || '';
        const formattedDate = formatFriendlyDate(event.created_at);

        return (
          <div key={event.id} className="activity-card">
            <div className="activity-icon">{icon}</div>
            <div className="activity-details">
              <strong>{title}</strong>
              {description && <p className="activity-description">{description}</p>}
              <p className="activity-date">{formattedDate}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTable;
