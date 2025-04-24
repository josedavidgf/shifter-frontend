import React from 'react';

const AppLoader = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p>Cargando Tanda...</p>
      {/* Aquí puedes meter un spinner bonito más adelante */}
    </div>
  );
};

export default AppLoader;
