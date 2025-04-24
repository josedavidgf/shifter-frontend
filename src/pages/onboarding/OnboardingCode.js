import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { validateAccessCode } from '../../services/accessCodeService';
import { useAuth } from '../../context/AuthContext';


export default function OnboardingCodeStep() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loading, isWorker } = useAuth();

  // Protege de render anticipado
  if (loading) return null;

  // Si el worker ya ha hecho onboarding, no debería ver esto
  if (isWorker?.onboarding_completed) {
    return <Navigate to="/calendar" />;
  }

  const handleValidateCode = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await validateAccessCode(code);
      const { hospital_id, worker_type_id } = response;

      navigate('/onboarding/confirm', {
        state: {
          hospital_id,
          worker_type_id,
          access_code: code
        }
      });
    } catch (err) {
      console.error('Error validando el código:', err.message);
      setError('Código inválido. Por favor verifica y vuelve a intentarlo.');
    }
  };

  return (
    <div>
      <h2>Introduce tu código de acceso</h2>
      <form onSubmit={handleValidateCode}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Código de acceso"
          maxLength={6}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Validar código</button>
      </form>
    </div>
  );
}
