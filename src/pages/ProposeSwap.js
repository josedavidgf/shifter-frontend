import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { proposeSwap } from '../services/swapService';
import useTrackPageView from '../hooks/useTrackPageView';

const ProposeSwap = () => {
  const { shift_id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    offered_date: '',
    offered_type: 'morning',
    offered_label: 'regular',
    swap_comments: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useTrackPageView('propose-swap');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const swap = await proposeSwap(shift_id, form, token); // 🛠️ capturamos swap aquí

      if (swap.status === 'accepted') {
        alert('✅ ¡Intercambio realizado directamente!');
      } else {
        alert('✅ Solicitud de intercambio creada. Pendiente de aceptación.');
      }

      navigate('/shifts/hospital');
    } catch (err) {
      console.error('❌ Error al proponer intercambio:', err.message);
      setError('Error al proponer intercambio');
    }
  };

  return (
    <div>
      <h2>Proponer intercambio</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Fecha que ofreces:</label>
        <input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          name="offered_date"
          value={form.offered_date}
          onChange={handleChange} />

        <label>Tipo de turno que ofreces:</label>
        <select name="offered_type" value={form.offered_type} onChange={handleChange}>
          <option value="morning">Mañana</option>
          <option value="evening">Tarde</option>
          <option value="night">Noche</option>
        </select>

        <label>Etiqueta:</label>
        <select name="offered_label" value={form.offered_label} onChange={handleChange}>
          <option value="regular">Regular</option>
          <option value="duty">Guardia</option>
        </select>
        <label>Comentarios:</label>
        <textarea
          name="swap_comments"
          value={form.swap_comments}
          onChange={handleChange}
          placeholder="Comentarios adicionales" />
        <br />
        <button type="submit">Enviar propuesta</button>
        <button type="button" onClick={() => navigate('/shifts/hospital')}>Cancelar</button>
      </form>
    </div>
  );
};

export default ProposeSwap;
