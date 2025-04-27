import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button'; // Ajusta ruta si necesario


const Verified = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ Email verificado correctamente</h2>
      <p>Ya puedes continuar con tu onboarding.</p>
      <Button
        label="Continua tu onboarding"
        variant="primary"
        size="lg"
        onClick={() => navigate('/onboarding/code')}
      />
    </div>
  );
};

export default Verified;
