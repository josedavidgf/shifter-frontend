import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUserApi } from '../../api/useUserApi';
import supabase from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import { useToast } from '../../hooks/useToast';
import { phonePrefixes } from '../../utils/phonePrefixes';
import InputField from '../../components/ui/InputField/InputField';
import PhoneInputGroup from '../../components/ui/PhoneInputGroup/PhoneInputGroup';

const PersonalInfo = () => {
  const { getToken } = useAuth();
  const { getFullWorkerProfile, updateWorkerInfo, loading } = useUserApi();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();

  const [initialForm, setInitialForm] = useState(null);

  const [form, setForm] = useState({
    name: '',
    surname: '',
    mobile_country_code: '+34',
    mobile_phone: '',
  });

  useEffect(() => {
    async function fetchData() {
      const token = await getToken();
      const data = await getFullWorkerProfile(token);

      if (data?.worker) {
        const fetchedForm = {
          name: data.worker.name || '',
          surname: data.worker.surname || '',
          mobile_country_code: data.worker.mobile_country_code || '+34',
          mobile_phone: data.worker.mobile_phone || '',
        };
        setForm(fetchedForm);
        setInitialForm(fetchedForm);
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
      showError('Error al subir imagen de perfil.');
      return;
    }

    showSuccess('Imagen subida correctamente');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneGroupChange = ({ prefix, phone }) => {
    setForm((prev) => ({
      ...prev,
      mobile_country_code: prefix,
      mobile_phone: phone
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (JSON.stringify(form) === JSON.stringify(initialForm)) {
      showWarning('No se han hecho cambios');
      return;
    }

    const cleanedPhone = form.mobile_phone.replace(/\s+/g, '');
    const isValidPhone = /^\d{9}$/.test(cleanedPhone);
    const isValidPrefix = phonePrefixes.some(p => p.code === form.mobile_country_code);

    if (!isValidPrefix) {
      showError('Selecciona un prefijo válido.');
      return;
    }

    if (!isValidPhone) {
      showError('El teléfono debe tener exactamente 9 dígitos.');
      return;
    }

    const token = await getToken();
    try {
      const updated = await updateWorkerInfo({
        ...form,
        mobile_phone: cleanedPhone
      }, token);

      if (updated) {
        showSuccess('Información actualizada');
      } else {
        showWarning('No se pudo actualizar la información');
      }
    } catch (err) {
      showError('Error al actualizar la información');
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
            <PhoneInputGroup
              prefix={form.mobile_country_code}
              phone={form.mobile_phone}
              onChange={handlePhoneGroupChange}
              prefixOptions={phonePrefixes.map(p => ({
                value: p.code,
                label: `${p.flag} ${p.code}`,
              }))}
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
              isLoading={loading}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
