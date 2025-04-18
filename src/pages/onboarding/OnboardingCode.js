import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAccessCode } from '../../services/accessCodeService';

export default function OnboardingCodeStep() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleValidateCode = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await validateAccessCode(code);
      const { hospital_id, worker_type_id } = response;

      // Guardamos datos en sessionStorage temporalmente para siguiente paso
      sessionStorage.setItem('hospital_id', hospital_id);
      sessionStorage.setItem('worker_type_id', worker_type_id);
      sessionStorage.setItem('access_code', code);

      navigate('/onboarding/confirm');
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
