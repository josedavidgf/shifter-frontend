import React, { useState, useEffect } from 'react';
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
import { useToast } from '../../hooks/useToast'; // ya lo usas en otras vistas
import useMinimumDelay from '../../hooks/useMinimumDelay';
import { useSwapPreferencesApi } from '../../api/useSwapPreferencesApi'; // o crea un hook nuevo
import { useShiftApi } from '../../api/useShiftApi'; // asegúrate de tener esta función creada
import Banner from '../../components/ui/Banner/Banner';


const ProposeSwap = () => {
  const { shift_id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { showSwapFeedback } = useSwapFeedback();
  const { shifts, loading: loadingShifts, error: errorShifts } = useAvailableShifts();
  const { proposeSwap, loading: loadingPropose, error: errorPropose } = useSwapApi(); // 🆕
  const { showError } = useToast();
  const showLoader = useMinimumDelay(loadingShifts, 500);
  const [enrichedShifts, setEnrichedShifts] = useState([]);
  const { getShiftById } = useShiftApi();
  const { getMySwapPreferences } = useSwapPreferencesApi();



  useEffect(() => {
    const enrichShiftsWithPreferences = async () => {
      if (!shifts.length || !shift_id) return;

      try {
        const token = await getToken();
        const publishedShift = await getShiftById(shift_id, token);




        const receiverId = publishedShift.worker?.worker_id;

        if (!receiverId) {
          console.error('⛔️ receiverId no encontrado en publishedShift:', publishedShift);
          setEnrichedShifts(shifts);
          return;
        }



        const preferences = await getMySwapPreferences(receiverId);


        const enriched = shifts.map((s) => {
          const isPreferred = preferences.some(
            (p) =>
              p.date === s.date &&
              p.preference_type === s.type
          );

          return { ...s, preferred: isPreferred };
        });



        setEnrichedShifts(enriched);
      } catch (err) {
        console.error('❌ Error enriqueciendo shifts con preferencias:', err);
        setEnrichedShifts(shifts); // fallback sin marcar
      }
    };

    enrichShiftsWithPreferences();
  }, [shifts, shift_id]);

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
      showError('Por favor selecciona un turno para ofrecer.');
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
        showError('No se pudo enviar la propuesta de intercambio. Intenta de nuevo.');
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

  if (showLoader) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader text="Cargando turnos disponibles..." />
      </div>
    );
  }

  if (errorShifts) {
    return <p style={{ color: 'red' }}>{errorShifts}</p>;
  }

  if (!loadingShifts && shifts.length === 0) {
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
              shifts={enrichedShifts}
              selectedShiftId={selectedShiftId}
              onSelect={handleSelectShift}
            />
            <Banner type="info">
              <p><strong>¿Qué significan los colores?</strong></p>
              <ul>
                <li><span style={{ color: 'green' }}>🟢</span> Turnos que tu compañero marca como disponible: La aceptación será automática, el resto requieren aceptación.</li>
                <li><span style={{ color: 'gray' }}>🔄</span> Turnos que has recibido: Transmite a tu compañero quien era el propietario del turno.</li>
              </ul>
            </Banner>

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
