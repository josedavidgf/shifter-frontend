// src/pages/profile/PersonalInfo.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFullWorkerProfile, updateWorkerInfo } from '../../services/userService';
import supabase from '../../config/supabase';
import BackButton from '../../components/BackButton';

const PersonalInfo = () => {
  const { getToken } = useAuth();
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

      setForm({
        name: data.worker.name,
        surname: data.worker.surname,
        mobile_country_code: data.worker.mobile_country_code || '',
        mobile_phone: data.worker.mobile_phone || '',
      });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    try {
      await updateWorkerInfo(form, token);
      setMessage('✅ Información actualizada');
    } catch (err) {
      setMessage('❌ Error al actualizar la información');
    }
  };

  return (
    <div className="container page">
      <h2 className="mb-3">Información personal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Apellidos:</label>
          <input name="surname" value={form.surname} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Prefijo:</label>
          <input
            name="mobile_country_code"
            placeholder="Ej: +34"
            value={form.mobile_country_code}
            onChange={handleChange}
            type="text"
          />
          <label>Teléfono:</label>
          <input
            name="mobile_phone"
            value={form.mobile_phone}
            onChange={handleChange}
            type="tel"
          />
        </div>
        <div className="form-group">
          <label>Imagen de perfil:</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Guardar
        </button>
      </form>

      {message && <p className="mt-2">{message}</p>}
      <BackButton />
    </div>
  );
};

export default PersonalInfo;