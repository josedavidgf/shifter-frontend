// components/ui/Cards/ActivityCardContent.jsx
import React from 'react';
import { formatFriendlyDateTime } from '../../../utils/formatFriendlyDate';

const ActivityCardContent = ({ icon, title, description, date }) => {
  return (
    <div className="activity-card-content">
      <div className="activity-line-row">
        <div className="activity-icon-wrapper">{icon}</div>
        <div className="activity-details">
          <strong className="activity-title">{title}</strong>
          {description && <p className="activity-description">{description}</p>}
          <p className="activity-date">{formatFriendlyDateTime(date)}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityCardContent;
