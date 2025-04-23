import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getFullWorkerProfile } from '../../services/userService';
import { createShift } from '../../services/shiftService';
import { getSpecialities } from '../../services/specialityService';
import useTrackPageView from '../../hooks/useTrackPageView';
import { format, parseISO } from 'date-fns';
import { translateShiftType } from '../../utils/translateShiftType';
import BackButton from '../../components/BackButton';


const CreateShift = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const prefilDate = params.get('date');
    const prefilShiftType = params.get('shift_type');
    // eslint-disable-next-line no-unused-vars
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { getToken } = useAuth();

    const [form, setForm] = useState({
        date: '',
        shift_type: '',
        //shift_label: '',
        speciality_id: '',
        shift_comments: '',
    });
    // eslint-disable-next-line no-unused-vars
    const [specialityId, setSpecialityId] = useState('');
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
                const profile = await getFullWorkerProfile(token);
                setSpecialityId(profile.specialityId);
                const specs = await getSpecialities(token)
                setSpecialities(specs);
                const match = specs.find(s => s.speciality_id === profile.specialityId);
                setSelectedSpeciality(match);

                setForm((prev) => ({
                    ...prev,
                    date: prefilDate || prev.date,
                    shift_type: prefilShiftType || prev.shift_type,
                    speciality_id: profile.specialityId,
                }));

                if (prefilDate || prefilShiftType) {
                    setForm((prev) => ({
                        ...prev,
                        date: prefilDate || prev.date,
                        shift_type: prefilShiftType || prev.shift_type,
                        speciality_id: profile.specialityId
                    }));
                }
            } catch (err) {
                setMessage('❌ Error al cargar el perfil');
            }


        }
        fetchData();
    }, [getToken, prefilDate, prefilShiftType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        console.log('🧾 Turno a enviar:', form);
        e.preventDefault();
        try {
            setIsSubmitting(true); // 🛠️ Empezamos envío
            const token = await getToken();
            console.log('form', form);
            await createShift({ ...form }, token);
            setMessage('✅ Turno publicado correctamente');
            setTimeout(() => navigate('/calendar'), 1500);
        } catch (err) {
            console.error('❌ Error al crear turno:', err.message);
            setMessage('❌ Error al crear turno');
        } finally {
            setIsSubmitting(false); // 🛠️ Terminamos envío, éxito o error
        }
    };



    return (
        <div>
            <h2>Crear Turno</h2>
            <form onSubmit={handleSubmit}>
                <label>Fecha:</label>
                <p>{form.date ? format(parseISO(form.date), 'dd/MM/yyyy') : '-'}</p>

                <label>Turno:</label>
                <p>{translateShiftType(form.shift_type)}</p>

                {/* <label>Etiqueta:</label> */}
                {/* <select name="shift_label" value={form.shift_label} onChange={handleChange} required>
                    <option value="regular">Regular</option>
                    <option value="duty">Guardia</option>
                </select> */}

                <label>Especialidad:</label>
                <input
                    type="hidden"
                    name="speciality_id"
                    value={form.specialityId}
                />
                {selectedSpeciality &&
                    <p>{selectedSpeciality.speciality_category} - {selectedSpeciality.speciality_subcategory}</p>
                }

                <label>Comentarios:</label>
                <textarea name="shift_comments" value={form.shift_comments} onChange={handleChange} />
                <br />

                <button
                    type="submit"
                    disabled={!form.date || !form.shift_type} // 🔥 Aquí
                >
                    {isSubmitting ? 'Publicando...' : 'Publicar Turno'}
                </button>

            </form>

            {message && <p>{message}</p>}
            <BackButton />
        </div>
    );
};

export default CreateShift;
