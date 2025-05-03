import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabase';
import { useToast } from '../../hooks/useToast';
import InputField from '../../components/ui/InputField/InputField';
import Button from '../../components/ui/Button/Button';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      showError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      showError("No hemos podido actualizar tu contraseña.");
    } else {
      showSuccess("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
      navigate('/login');
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <>
      <HeaderSecondLevel
        title="Nueva contraseña"
        showBackButton
        onBack={handleBack}
      />
      <div className="page">
        <div className="container">
          <form onSubmit={handleSubmit}>
            <InputField
              name="newPassword"
              label="Nueva contraseña"
              placeholder="••••••••"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <InputField
              name="confirmPassword"
              label="Repite la contraseña"
              placeholder="••••••••"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              label="Cambiar contraseña"
              type="submit"
              isLoading={loading}
              variant="primary"
              size="lg"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
