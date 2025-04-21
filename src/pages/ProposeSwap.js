import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { proposeSwap } from '../services/swapService';
import useTrackPageView from '../hooks/useTrackPageView';
import { useSwapFeedback } from '../hooks/useSwapFeedback';
import { getShiftById } from '../services/shiftService'; // (ahora te hago el servicio si quieres)


const ProposeSwap = () => {
  const { shift_id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { showSwapFeedback } = useSwapFeedback();
  const [preferences, setPreferences] = useState([]);


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

  useEffect(() => {
    const fetchShiftDetails = async () => {
      try {
        const token = await getToken();
        const shiftDetail = await getShiftById(shift_id, token);
        setPreferences(shiftDetail.worker.swap_preferences || []);
      } catch (err) {
        console.error('Error fetching shift details:', err.message);
      }
    };

    fetchShiftDetails();
  }, [shift_id, getToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const swap = await proposeSwap(shift_id, form, token); // 🛠️ capturamos swap aquí

      showSwapFeedback(swap); // 🔥 Aquí

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
      {preferences.length > 0 && (
        <div>
          <h3>Disponibilidad del trabajador</h3>
          <ul>
            {preferences.map((pref) => (
              <li key={pref.preference_id}>
                {new Date(pref.date).toLocaleDateString()} - {pref.preference_type === 'morning' ? 'Mañana' : pref.preference_type === 'evening' ? 'Tarde' : 'Noche'}
              </li>
            ))}
          </ul>
        </div>
      )}

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
