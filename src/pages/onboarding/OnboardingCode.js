import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { validateAccessCode } from '../../services/accessCodeService';
import { useAuth } from '../../context/AuthContext';
import { getHospitals } from '../../services/hospitalService';
import { getWorkerTypes } from '../../services/workerService';
import InputField from '../../components/ui/InputField/InputField';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';


export default function OnboardingCodeStep() {
  const [code, setCode] = useState('');
  const { getToken } = useAuth();
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
  
      const token = await getToken();
      const hospitals = await getHospitals(token);
      const workerTypes = await getWorkerTypes(token);
  
      const hospital = hospitals.find(h => h.hospital_id === hospital_id);
      const workerType = workerTypes.find(w => w.worker_type_id === worker_type_id);
  
      const hospitalName = hospital?.name || '';
      const workerTypeName = workerType?.worker_type_name || '';
  
      navigate('/onboarding/confirm', {
        state: {
          hospital_id,
          worker_type_id,
          hospitalName,
          workerTypeName,
          access_code: code
        }
      });
    } catch (err) {
      console.error('Error validando el código:', err.message);
      setError('Código inválido. Por favor verifica y vuelve a intentarlo.');
    }
  };
  
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  return (
    <>
      <HeaderSecondLevel
        showBackButton
        onBack={handleBack}
      />
      <div className="page page-primary">
        <div className='container'>
          <h2>Bienvenido a la plataforma</h2>
          <p>Para completar tu registro, por favor introduce el código de acceso que te ha sido proporcionado.</p>
          <p>Si no tienes un código, contacta con tu administrador.</p>
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
            <button 
              className='btn btn-primary' 
              type="submit"
              disabled={!code}>
                Validar código
              </button>
          </form>
        </div>
      </div >
    </>
  );
}
