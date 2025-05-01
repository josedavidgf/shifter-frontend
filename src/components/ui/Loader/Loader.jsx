import React from 'react';
import logoTanda from '../../../assets/logo-tanda-light.png';


export default function Loader({ text = 'Cargando...' }) {
  return (
    <div className="loader-splash">
      <img src={logoTanda} alt="Tanda Logo" className="logo-splash" />
      <div className="progress-bar-container">
        <div className="progress-bar" />
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
}
