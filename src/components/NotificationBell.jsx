import React from 'react';
import { Bell, BellSimple } from '../theme/icons';
import { useUserEvents } from '../hooks/useUserEvents';

export default function NotificationBell() {
  const { events } = useUserEvents();
  const hasUnseen = events.some((e) => !e.seen);

  return (
    <div className="notification-dot-wrapper">
      <BellSimple size={32} weight="bold" />
      {hasUnseen && <span className="notification-dot" />}
    </div>
  );
}
