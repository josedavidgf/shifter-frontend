import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSwapApi } from '../../api/useSwapApi';
import useTrackPageView from '../../hooks/useTrackPageView';
import { useSwapFeedback } from '../../hooks/useSwapFeedback';
import useAvailableShifts from '../../hooks/useAvailableShifts';
import ShiftSelector from '../../components/ShiftSelector';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import Loader from '../../components/ui/Loader/Loader';
import EmptyState from '../../components/ui/EmptyState/EmptyState';


const ProposeSwap = () => {
  const { shift_id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { showSwapFeedback } = useSwapFeedback();
  const { shifts, loading: loadingShifts, error: errorShifts } = useAvailableShifts();
  const { proposeSwap, loading: loadingPropose, error: errorPropose } = useSwapApi(); // 🆕


  const [selectedShift, setSelectedShift] = useState(null);
  const [selectedShiftId, setSelectedShiftId] = useState('');
  const [swapComments, setSwapComments] = useState('');

  useTrackPageView('propose-swap');

  const handleSelectShift = (shift) => {
    setSelectedShift(shift);
    setSelectedShiftId(shift.id); // 🔥 Guardamos el ID seleccionado
  };

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

      const result = await proposeSwap(shift_id, form, token);
      if (result) {
        showSwapFeedback(result);
        navigate('/shifts/hospital');
      } else {
        alert('No se pudo enviar la propuesta de intercambio.');
      }
    } catch (err) {
      console.error('❌ Error al proponer intercambio:', err.message);
      alert('Error inesperado al proponer intercambio.');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  if (loadingShifts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader text="Cargando turnos disponibles..." />
      </div>
    );
  }

  if (errorShifts) {
    return <p style={{ color: 'red' }}>{errorShifts}</p>;
  }

  if (shifts.length === 0) {
    return (
      <>
        <HeaderSecondLevel
          title="Proponer intercambio"
          showBackButton
          onBack={handleBack}
        />
        <div className="page page-secondary">
          <div className="container">

            <EmptyState
              title="No hay turnos que ofrecer"
              description="Añade de forma masiva tu plantilla."
              ctaLabel="Ir al Calendario"
              onCtaClick={() => navigate('/calendar')}
            />
          </div>
        </div>
      </>
    );
  }
  

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
            <ShiftSelector
              shifts={shifts}
              selectedShiftId={selectedShiftId}
              onSelect={handleSelectShift}
            />
            <div className="form-group">
              <label>Comentarios:</label>
              <textarea
                name="swap_comments"
                value={swapComments}
                onChange={(e) => setSwapComments(e.target.value)}
                placeholder="Comentarios adicionales"
              />
            </div>

            {errorPropose && (
              <p style={{ color: 'red', marginTop: '10px' }}>
                {errorPropose}
              </p>
            )}

            <div className="btn-group mt-3">
              <Button
                label="Enviar propuesta"
                variant="primary"
                size="lg"
                type="submit"
                disabled={!selectedShift} // Deshabilitar si no hay turno seleccionado
                isLoading={loadingPropose}
              />
            </div>
          </form>
        </div>
      </div>
    </>

  );
};

export default ProposeSwap;
