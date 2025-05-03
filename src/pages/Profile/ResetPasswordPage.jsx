import { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import supabase from '../../config/supabase';

import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';

const ResetPasswordPage = () => {
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      showError('Por favor completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error('❌ Error actualizando contraseña:', error.message);
      showError('No se pudo actualizar la contraseña. Inténtalo de nuevo.');
    } else {
      showSuccess('Contraseña actualizada con éxito.');
      navigate('/profile');
    }

    setLoading(false);
  };

  return (
    <>
      <HeaderSecondLevel title="Cambiar contraseña" showBackButton onBack={() => navigate(-1)} />
      <div className="page">
        <div className="container">
          <InputField
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <InputField
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            label="Guardar contraseña"
            onClick={handleSubmit}
            isLoading={loading}
            variant="primary"
            size="lg"
          />
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
