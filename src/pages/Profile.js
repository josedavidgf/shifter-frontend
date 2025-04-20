import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getFullWorkerProfile,
  updateWorkerInfo,
  updateWorkerHospital,
  updateWorkerSpeciality,
} from '../services/userService';
import { getHospitals } from '../services/hospitalService';
import { getSpecialities } from '../services/specialityService';
import { useNavigate } from 'react-router-dom';
import useTrackPageView from '../hooks/useTrackPageView';

const Profile = () => {
  const { getToken } = useAuth();
  const [worker, setWorker] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    hospital_id: '',
    speciality_id: '',
    qualification_level: 'resident',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useTrackPageView('profile');

  useEffect(() => {
    async function fetchData() {
        const token = await getToken();
      const data = await getFullWorkerProfile(token);
      setWorker(data.worker);
      setForm({
        name: data.worker.name,
        surname: data.worker.surname,
        hospital_id: data.hospital?.hospital_id || '',
        speciality_id: data.speciality?.speciality_id || '',
        qualification_level: data.worker.qualification_level || 'resident',
      });
      setHospitals(await getHospitals(token));
      setSpecialities(await getSpecialities(token));
    }
    fetchData();
  }, [getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await getToken();
    try {
      await updateWorkerInfo({ name: form.name, surname: form.surname }, token);
      await updateWorkerHospital({ hospital_id: form.hospital_id }, token);
      await updateWorkerSpeciality(
        {
          speciality_id: form.speciality_id,
          qualification_level: form.qualification_level,
        },
        token
      );
      setMessage('✅ Perfil actualizado correctamente');
    } catch (err) {
      setMessage('❌ Error al actualizar el perfil');
    }
  };

  if (!worker) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Editar Perfil</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Apellidos:</label>
        <input name="surname" value={form.surname} onChange={handleChange} required />

        <label>Hospital:</label>
        <select name="hospital_id" value={form.hospital_id} onChange={handleChange} required>
          <option value="">Selecciona un hospital</option>
          {hospitals.map((h) => (
            <option key={h.hospital_id} value={h.hospital_id}>{h.name}</option>
          ))}
        </select>

        <label>Especialidad:</label>
        <select name="speciality_id" value={form.speciality_id} onChange={handleChange} required>
          <option value="">Selecciona una especialidad</option>
          {specialities.map((s) => (
            <option key={s.speciality_id} value={s.speciality_id}>
              {s.speciality_category} - {s.speciality_subcategory}
            </option>
          ))}
        </select>

        <label>Nivel:</label>
        <select name="qualification_level" value={form.qualification_level} onChange={handleChange}>
          <option value="resident">Residente</option>
          <option value="specialist">Especialista</option>
        </select>

        <button type="submit">Guardar cambios</button>
      </form>
      <hr />
      <button onClick={() => navigate('/preferences')}>Preferencias de comunicación</button>
      <hr />
      {message && <p>{message}</p>}
      <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
    </div>
  );
};

export default Profile;