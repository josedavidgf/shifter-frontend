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

  const handleBack = async () => {
    await markAllAsSeen();
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
            <Loader text="Cargando actividad..." minTime={50} />
          ) : (
            <ActivityTable events={events} />
          )}
        </div>
      </div>
    </>
  );
};

export default Activity;
