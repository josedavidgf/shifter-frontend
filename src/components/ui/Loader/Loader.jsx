import React, { useEffect, useState } from 'react';
import logoTanda from '../../../assets/logo-tanda-light.png';

export default function Loader({ text = 'Cargando...', minTime = 600 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), minTime);
    return () => clearTimeout(timeout);
  }, [minTime]);

  if (!visible) return null;

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
