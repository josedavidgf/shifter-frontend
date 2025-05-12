import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { shiftTypeLabels } from '../../utils/labelMaps';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import InputField from '../../components/ui/InputField/InputField';
import { useToast } from '../../hooks/useToast';
import { useShiftApi } from '../../api/useShiftApi';
import { useAuth } from '../../context/AuthContext';
import useTrackPageView from '../../hooks/useTrackPageView';
import { trackEvent } from '../../hooks/useTrackPageView'; // Importamos trackEvent
import { EVENTS } from '../../utils/amplitudeEvents'; // Importamos los eventos

const CreateShift = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken, isWorker } = useAuth();
  const { createShift, loading: creatingShift } = useShiftApi();
  const { showSuccess, showError } = useToast();

  useTrackPageView('create-shift');

  const params = new URLSearchParams(location.search);
  const prefilDate = params.get('date');
  const prefilShiftType = params.get('shift_type');

  const [invalidParams, setInvalidParams] = useState(false);

  useEffect(() => {
    if (!prefilDate || !prefilShiftType || !isWorker?.workers_specialities?.[0]?.speciality_id) {
      setInvalidParams(true);
    }
  }, [prefilDate, prefilShiftType, isWorker]);

  useEffect(() => {
    if (invalidParams) {
      navigate('/calendar');
    }
  }, [invalidParams, navigate]);


  const [form, setForm] = useState({
    date: prefilDate,
    shift_type: prefilShiftType,
    speciality_id: isWorker.workers_specialities[0].speciality_id,
    shift_comments: '',
  });

  const speciality = isWorker.workers_specialities[0].specialities;
  const specialityLabel = `${speciality?.speciality_category}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const success = await createShift(form, token);

      // Tracking del evento "Publicar turno"
      trackEvent(EVENTS.PUBLISH_SHIFT_BUTTON_CLICKED, {
        date: form.date,
        shiftType: form.shift_type,
        specialityId: form.speciality_id,
        hasComments: !!form.shift_comments,
        commentsLength: form.shift_comments.length || 0,
      });

      if (success) {
        showSuccess('Turno publicado correctamente');
        setTimeout(() => navigate('/calendar'), 1000);
      } else {
        showError('Error al publicar el turno');
      }
    } catch (err) {
      console.error('❌ Error creando turno:', err.message);
      showError('Error al publicar el turno');
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/calendar');
    }
  };

  return (
    <>
      <HeaderSecondLevel title="Crear turno" showBackButton onBack={handleBack} />
      <div className="page">
        <div className="container">
          <div className="create-shift-container">
            <InputField
              name="Shift"
              label="Turno"
              value={`${format(parseISO(form.date), 'dd/MM/yyyy')} de ${shiftTypeLabels[form.shift_type]}`}
              disabled
              readOnly
            />

            <InputField
              name="speciality"
              label="Servicio"
              value={specialityLabel}
              disabled
              readOnly
            />

            <InputField
              name="Comentarios"
              label="Comentarios"
              value={form.shift_comments}
              placeholder="Añade comentarios si lo deseas"
              onChange={(e) =>
                setForm((prev) => ({ ...prev, shift_comments: e.target.value }))
              }
            />
          </div>

          <Button
            label="Publicar"
            variant="primary"
            size="lg"
            type="submit"
            onClick={handleSubmit}
            disabled={creatingShift}
            isLoading={creatingShift}
          />
        </div>
      </div>
    </>
  );
};

export default CreateShift;
