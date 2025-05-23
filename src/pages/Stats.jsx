import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderSecondLevel from '../components/ui/Header/HeaderSecondLevel';

const Stats = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderSecondLevel
        title="Turnos y horas"
        showBackButton
        onBack={() => navigate('/')}
      />
      <div className="panel-content">
        {/* Aquí irá el contenido de estadísticas */}
      </div>
    </>
  );
};

export default Stats;