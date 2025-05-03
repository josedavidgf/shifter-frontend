import React from 'react';
import logoTanda from '../../assets/logo-tanda-light.png';


const AppLoader = () => {
  return (
    <div className="loader-splash">
      <img src={logoTanda} alt="Tanda Logo" className="logo-splash" />
      <div className="progress-bar-container">
        <div className="progress-bar" />
        <p className="loader-text">Cargando Tanda...</p>
      </div>
    </div >
  );
};

export default AppLoader;