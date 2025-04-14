import React from 'react';
import { useNavigate } from 'react-router-dom';

const Verified = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ Email verificado correctamente</h2>
      <p>Ya puedes iniciar sesión con tu cuenta.</p>
      <button onClick={() => navigate('/login')} style={{ marginTop: '1rem' }}>
        Ir al login
      </button>
    </div>
  );
};

export default Verified;
