import React from 'react';
import { useNavigate } from 'react-router-dom';

const Verified = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ Email verificado correctamente</h2>
      <p>Ya puedes continuar con tu onboarding.</p>
      <button onClick={() => navigate('/onboarding')} style={{ marginTop: '1rem' }}>
        Continua tu onboarding
      </button>
    </div>
  );
};

export default Verified;
