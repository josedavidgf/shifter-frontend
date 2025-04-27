import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserApi } from '../../api/useUserApi';
import { useSpecialityApi } from '../../api/useSpecialityApi';
import { useShiftApi } from '../../api/useShiftApi';
import useTrackPageView from '../../hooks/useTrackPageView';
import { format, parseISO } from 'date-fns';
import { translateShiftType } from '../../utils/translateShiftType';
import HeaderSecondLevel from '../../components/ui/Header/HeaderSecondLevel';
import Button from '../../components/ui/Button/Button'; // Ajusta ruta si necesario


const CreateShift = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getToken } = useAuth();
    const { getFullWorkerProfile } = useUserApi();
    const { getSpecialities } = useSpecialityApi();
    const { createShift, loading: creatingShift, error: errorCreatingShift } = useShiftApi(); // 🆕

    const params = new URLSearchParams(location.search);
    const prefilDate = params.get('date');
    const prefilShiftType = params.get('shift_type');

    // eslint-disable-next-line no-unused-vars
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);
    const [specialityId, setSpecialityId] = useState('');
    const [form, setForm] = useState({
        date: '',
        shift_type: '',
        //shift_label: '',
        speciality_id: '',
        shift_comments: '',
    });

    const [message, setMessage] = useState('');

    useTrackPageView('create-shift');

    useEffect(() => {
        if (!prefilDate || !prefilShiftType) {
            navigate('/shifts/hospital');
        }
    }, [prefilDate, prefilShiftType, navigate]);


    useEffect(() => {
        async function fetchData() {
            try {
              const token = await getToken();
              const profile = await getFullWorkerProfile(token); // ✅ Vía hook
              setSpecialityId(profile.specialityId);
          
              const specs = await getSpecialities(token); // ✅ Vía hook
              setSpecialities(specs);
          
              const match = specs.find(s => s.speciality_id === profile.specialityId);
              setSelectedSpeciality(match);
          
              setForm(prev => ({
                ...prev,
                date: prefilDate || prev.date,
                shift_type: prefilShiftType || prev.shift_type,
                speciality_id: profile.specialityId,
              }));
            } catch (err) {
              console.error('Error loading profile or specialities:', err.message);
              setMessage('❌ Error al cargar el perfil o especialidad');
            }
          }          

        fetchData();
    }, [getToken, prefilDate, prefilShiftType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const success = await createShift({ ...form }, token);
            if (success) {
                setMessage('✅ Turno publicado correctamente');
                setTimeout(() => navigate('/calendar'), 1500);
            } else {
                setMessage('❌ Error al publicar turno');
            }
        } catch (err) {
            console.error('Error creating shift:', err.message);
            setMessage('❌ Error al publicar turno');
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
            <div className="page page-secondary">
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <label>Fecha:</label>
                        <p>{form.date ? format(parseISO(form.date), 'dd/MM/yyyy') : '-'}</p>

                        <label>Turno:</label>
                        <p>{translateShiftType(form.shift_type)}</p>

                        <label>Especialidad:</label>
                        {selectedSpeciality ? (
                            <p>{selectedSpeciality.speciality_category} - {selectedSpeciality.speciality_subcategory}</p>
                        ) : (
                            <p>Especialidad no disponible</p>
                        )}

                        <label>Comentarios:</label>
                        <textarea
                            name="shift_comments"
                            value={form.shift_comments}
                            onChange={handleChange}
                        />

                        <br />
                        <Button
                            label="Publicar"
                            variant="primary"
                            size="lg"
                            type="submit"
                            disabled={!form.date || !form.shift_type || creatingShift}
                            isLoading={creatingShift}
                        />
                    </form>

                    {message && <p style={{ marginTop: '10px' }}>{message}</p>}
                    {errorCreatingShift && (
                        <p style={{ color: 'red', marginTop: '10px' }}>
                            {errorCreatingShift}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateShift;
