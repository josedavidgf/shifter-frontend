import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getShiftById, updateShift } from '../services/shiftService';

const EditShift = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: '',
    shift_type: '',
    shift_label: '',
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchShift() {
      try {
        console.log('🟡 Entrando en EditShift con ID:',id);
        const token = await getToken();
        console.log('🟡 Token:', token);
        const data = await getShiftById(id, token);
        console.log('🟡 Datos del turno:', data);
        setForm({
          date: data.date || '',
          shift_type: data.shift_type || '',
          shift_label: data.shift_label || '',
        });
      } catch (err) {
        console.error('❌ Error al cargar turno:', err.message);
        setError('Error al cargar el turno.');
      }
    }
    fetchShift();
  }, [id, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      await updateShift(id, form, token);
      alert('✅ Turno actualizado con éxito');
      navigate('/shifts/my');
    } catch (err) {
      console.error('❌ Error al actualizar turno:', err.message);
      setError('No se pudo actualizar el turno.');
    }
  };

  return (
    <div>
      <h2>Editar Turno</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Fecha:</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>Tipo de turno:</label>
        <select name="shift_type" value={form.shift_type} onChange={handleChange} required>
          <option value="">Selecciona</option>
          <option value="morning">Mañana</option>
          <option value="evening">Tarde</option>
          <option value="night">Noche</option>
        </select>

        <label>Etiqueta:</label>
        <select name="shift_label" value={form.shift_label} onChange={handleChange} required>
          <option value="">Selecciona</option>
          <option value="regular">Regular</option>
          <option value="duty">Guardia</option>
        </select>

        <button type="submit">💾 Guardar cambios</button>
        <button type="button" onClick={() => navigate('/shifts/my')}>⬅ Cancelar</button>
      </form>
    </div>
  );
};

export default EditShift;
