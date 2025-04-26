import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { validateAccessCode } from '../../services/accessCodeService';
import { useAuth } from '../../context/AuthContext';
import InputField from '../../components/ui/InputField/InputField';


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
        <InputField
          name="access-code"
          label="Código de acceso"
          placeholder="Introduce tu código de acceso"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
          error={error}
          errorMessage="El código de acceso es obligatorio"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className='btn btn-primary' type="submit">Validar código</button>
      </form>
    </div>
  );
}
