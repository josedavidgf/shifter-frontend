import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserApi } from '../../api/useUserApi';
import supabase from '../../config/supabase';
import InputField from '../../components/ui/InputField/InputField';
import { useNavigate } from 'react-router-dom';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario


const PersonalInfo = () => {
  const { getToken } = useAuth();
  const { getFullWorkerProfile, updateWorkerInfo, loading, error: apiError } = useUserApi();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    mobile_country_code: '',
    mobile_phone: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      const token = await getToken();
      const data = await getFullWorkerProfile(token);

      if (data?.worker) {
        setForm({
          name: data.worker.name,
          surname: data.worker.surname,
          mobile_country_code: data.worker.mobile_country_code || '',
          mobile_phone: data.worker.mobile_phone || '',
        });
      }
    }

    fetchData();
  }, [getToken]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const user = await supabase.auth.getUser();
    const userId = user?.data?.user?.id;
    const filePath = `${userId}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        metadata: { user_id: userId }
      });

    if (uploadError) {
      console.error('Error subiendo imagen:', uploadError.message);
      return;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const token = await getToken();
    try {
      const updated = await updateWorkerInfo(form, token);
      if (updated) {
        setMessage('✅ Información actualizada');
      } else {
        setMessage('❌ No se pudo actualizar la información');
      }
    } catch (err) {
      setMessage('❌ Error al actualizar la información');
    }
  }

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
        title="Datos de contacto"
        showBackButton
        onBack={handleBack}
      />
      <div className="page page-secondary">
        <div className="container">

          <form onSubmit={handleSubmit}>
            <InputField
              name="name"
              label="Nombre"
              placeholder="Introduce tu nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
            <InputField
              name="surname"
              label="Apellidos"
              placeholder="Introduce tus apellidos"
              value={form.surname}
              onChange={handleChange}
              required
            />
            <InputField
              name="mobile_country_code"
              label="Prefijo"
              placeholder="Ej: +34"
              value={form.mobile_country_code}
              onChange={handleChange}
              type="text"
            />
            <InputField
              name="mobile_phone"
              label="Teléfono"
              placeholder="Introduce tu teléfono"
              value={form.mobile_phone}
              onChange={handleChange}
              type="tel"
            />

            <div className="form-group">
              <label>Imagen de perfil:</label>
              <input type="file" accept="image/*" onChange={handleAvatarChange} />
            </div>
            <Button
              label="Guardar"
              variant="primary"
              size="lg"
              type="submit"
              disabled={!form.name || !form.surname || loading}
              isLoading={loading} // 🆕
            />
          </form>


          {apiError && <p style={{ color: 'red', marginTop: '1rem' }}>{apiError}</p>}
          {message && <p className="mt-2">{message}</p>}
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;