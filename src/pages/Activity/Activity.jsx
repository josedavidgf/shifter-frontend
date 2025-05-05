import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserEvents } from '../../hooks/useUserEvents';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Loader from '../../components/ui/Loader/Loader';
import ActivityTable from '../../components/ActivityTable';

const Activity = () => {
  const { events, isLoading, markAllAsSeen, setEvents } = useUserEvents();
  const navigate = useNavigate();
  const hasMarkedRef = useRef(false);

  useEffect(() => {
    if (events.length === 0 || hasMarkedRef.current) return;

    const unseen = events.filter((e) => !e.seen);
    if (unseen.length > 0) {
      hasMarkedRef.current = true;
      markAllAsSeen().then(() => {
        // Actualiza el estado local para evitar flicker
        const updated = events.map((e) => ({ ...e, seen: true }));
        setEvents(updated);
      });
    }
  }, [events.length]);

  const handleBack = () => {
      navigate('/calendar');
  };

  return (
    <>
      <HeaderSecondLevel
        title="Tu actividad"
        showBackButton
        onBack={handleBack}
      />
      <div className="page page-secondary">
        <div className="container">
          {isLoading ? (
            <Loader text="Cargando actividad..." />
          ) : (
            <ActivityTable events={events} />
          )}
        </div>
      </div>
    </>
  );
};

export default Activity;
