import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserApi } from '../../api/useUserApi';
import { useSpecialityApi } from '../../api/useSpecialityApi';
import { useShiftApi } from '../../api/useShiftApi';
import useTrackPageView from '../../hooks/useTrackPageView';
import { format, parseISO } from 'date-fns';
import { shiftTypeLabels } from '../../utils/labelMaps';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button';
import InputField from '../../components/ui/InputField/InputField';
import Loader from '../../components/ui/Loader/Loader';
import { useToast } from '../../hooks/useToast';

const CreateShift = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getToken } = useAuth();
  const { getFullWorkerProfile } = useUserApi();
  const { getSpecialities } = useSpecialityApi();
  const { createShift, loading: creatingShift } = useShiftApi();
  const { showSuccess, showError } = useToast();

  const [loadingShift, setLoadingShift] = useState(true);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);

  const params = new URLSearchParams(location.search);
  const prefilDate = params.get('date');
  const prefilShiftType = params.get('shift_type');

  const [form, setForm] = useState({
    date: '',
    shift_type: '',
    speciality_id: '',
    shift_comments: '',
  });

  useTrackPageView('create-shift');

  useEffect(() => {
    if (!prefilDate || !prefilShiftType) {
      navigate('/shifts/hospital');
    }
  }, [prefilDate, prefilShiftType, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingShift(true);
        const token = await getToken();
        const profile = await getFullWorkerProfile(token);
        const specs = await getSpecialities(token);

        const match = specs.find(s => s.speciality_id === profile.specialityId);
        setSpecialities(specs);
        setSelectedSpeciality(match);

        setForm(prev => ({
          ...prev,
          date: prefilDate || prev.date,
          shift_type: prefilShiftType || prev.shift_type,
          speciality_id: profile.specialityId,
        }));
      } catch (err) {
        console.error('❌ Error al cargar el perfil o especialidad:', err.message);
        showError('No se pudo cargar tu perfil o especialidad.');
      } finally {
        setLoadingShift(false);
      }
    }

    fetchData();
  }, [getToken, prefilDate, prefilShiftType, showError]);

  if (loadingShift) {
    return <Loader text="Cargando información del turno..." />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const success = await createShift({ ...form }, token);
      if (success) {
        showSuccess('Turno publicado correctamente');
        setTimeout(() => navigate('/calendar'), 1000); // Alternativa: navigate directo
      } else {
        showError('Error al publicar el turno');
      }
    } catch (err) {
      console.error('❌ Error creando el turno:', err.message);
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
              value={`${form.date ? format(parseISO(form.date), 'dd/MM/yyyy') : '-'} de ${shiftTypeLabels[form.shift_type]}`}
              disabled
              readOnly
            />

            <InputField
              name="speciality"
              label="Servicio"
              value={selectedSpeciality ? `${selectedSpeciality.speciality_category} - ${selectedSpeciality.speciality_subcategory}` : 'No disponible'}
              disabled
              readOnly
            />

            <InputField
              name="shift_comments"
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
            disabled={!form.date || !form.shift_type || creatingShift}
            isLoading={creatingShift}
          />
        </div>
      </div>
    </>
  );
};

export default CreateShift;
