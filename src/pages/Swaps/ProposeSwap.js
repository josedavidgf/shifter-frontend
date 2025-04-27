import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { proposeSwap } from '../../services/swapService';
import useTrackPageView from '../../hooks/useTrackPageView';
import { useSwapFeedback } from '../../hooks/useSwapFeedback';
import useAvailableShifts from '../../hooks/useAvailableShifts';
import ShiftSelector from '../../components/ShiftSelector';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';

const ProposeSwap = () => {
  const { shift_id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { showSwapFeedback } = useSwapFeedback();
  const { shifts, loading, error } = useAvailableShifts();

  const [selectedShift, setSelectedShift] = useState(null);
  const [swapComments, setSwapComments] = useState('');

  useTrackPageView('propose-swap');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShift) {
      alert('Por favor selecciona un turno para ofrecer.');
      return;
    }

    try {
      const token = await getToken();

      const form = {
        offered_date: selectedShift.date,
        offered_type: selectedShift.type,
        offered_label: selectedShift.label || 'regular',
        swap_comments: swapComments,
      };

      const swap = await proposeSwap(shift_id, form, token);
      showSwapFeedback(swap);

      navigate('/shifts/hospital');
    } catch (err) {
      console.error('❌ Error al proponer intercambio:', err.message);
      alert('Error al proponer intercambio.');
    }
  };

  if (loading) {
    return <p>Cargando turnos disponibles...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (shifts.length === 0) {
    return (
      <div>
        <p>No tienes turnos disponibles para ofrecer.</p>
        <button type="button" onClick={() => navigate('/shifts/hospital')}>
          Volver
        </button>
      </div>
    );
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
        title="Proponer intercambio"
        showBackButton
        onBack={handleBack}
      />
      <div className="page page-secondary">
        <div className="container">
          <form onSubmit={handleSubmit} className="propose-form">
            <ShiftSelector shifts={shifts} onSelect={setSelectedShift} />

            <div className="form-group">
              <label>Comentarios:</label>
              <textarea
                name="swap_comments"
                value={swapComments}
                onChange={(e) => setSwapComments(e.target.value)}
                placeholder="Comentarios adicionales"
              />
            </div>

            <div className="btn-group mt-3">
              <button type="submit" className="btn btn-primary">Enviar propuesta</button>
            </div>
          </form>
        </div>
      </div>
    </>

  );
};

export default ProposeSwap;
