import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserEvents } from '../../hooks/useUserEvents';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Loader from '../../components/ui/Loader/Loader';
import ActivityTable from '../../components/ActivityTable';

const Activity = () => {
  const { events, isLoading, markAllAsSeen, refresh } = useUserEvents();
  const navigate = useNavigate();

  useEffect(() => {
    const markAndRefresh = async () => {
      const unseen = events.filter(e => !e.seen);
      if (unseen.length > 0) {
        await markAllAsSeen();
        await refresh();
      }
    };

    if (events.length > 0) {
      markAndRefresh();
    }
  }, []); // <-- importante: [] para evitar que se dispare con cada cambio en events


  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  return (
    <>
      <HeaderSecondLevel
        title="Tu actividad"
        showBackButton
        onBack={handleBack}
      />      <div className="page page-secondary">
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
