import React from 'react';
import { Bell } from '../theme/icons';
import { useUserEvents } from '../hooks/useUserEvents';

export default function NotificationBell() {
  const { events } = useUserEvents();
  const hasUnseen = events.some((e) => !e.seen);

  console.log('🔔 Eventos:', events);
  console.log('🔴 Hay no vistos:', events.some((e) => !e.seen));


  return (
    <div className="notification-dot-wrapper">
      <Bell size={32} weight="regular" />
      {hasUnseen && <span className="notification-dot" />}
    </div>
  );
}
