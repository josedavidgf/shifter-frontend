import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFullWorkerProfile } from '../services/userService';
import { createShift } from '../services/shiftService';
import { getSpecialities } from '../services/specialityService';
import useTrackPageView from '../hooks/useTrackPageView';


const CreateShift = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const prefilDate = params.get('date');
    const prefilShiftType = params.get('shift_type');
    // eslint-disable-next-line no-unused-vars
    const [specialities, setSpecialities] = useState([]);
    const [selectedSpeciality, setSelectedSpeciality] = useState(null);


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
    const [preferences, setPreferences] = useState([]);
    const [message, setMessage] = useState('');

    useTrackPageView('create-shift');

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
    const handleAddPreference = () => {
        if (preferences.length >= 3) return;
        setPreferences([...preferences, { preferred_date: '', preferred_type: 'morning', preferred_label: 'regular' }]);
    };

    const handlePreferenceChange = (index, field, value) => {
        const updated = [...preferences];
        console.log('🧾 Preferencias actualizadas:', updated);
        updated[index][field] = value;
        console.log('🧾 Preferencia actualizada:', updated[index]);
        setPreferences(updated);
    };

    const handleRemovePreference = (index) => {
        setPreferences(preferences.filter((_, i) => i !== index));
    };


    const handleSubmit = async (e) => {
        console.log('🧾 Turno a enviar:', form);
        e.preventDefault();
        try {
            const token = await getToken();
            console.log('form',form);
            await createShift({ ...form, preferences }, token);
            setMessage('✅ Turno publicado correctamente');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            console.error('❌ Error al crear turno:', err.message);
            setMessage('❌ Error al crear turno');
        }
    };

    return (
        <div>
            <h2>Crear Turno</h2>
            <form onSubmit={handleSubmit}>
                <label>Fecha:</label>
                <input type="date" min={new Date().toISOString().split('T')[0]} name="date" value={form.date} onChange={handleChange} required />
                <label>Turno:</label>
                <select name="shift_type" value={form.shift_type} onChange={handleChange} required>
                    <option value="morning">Mañana</option>
                    <option value="evening">Tarde</option>
                    <option value="night">Noche</option>
                </select>

                <label>Etiqueta:</label>
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

                {preferences.map((pref, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', marginTop: '1rem', padding: '0.5rem' }}>
                        <strong>Preferencia {index + 1}</strong>
                        <br />
                        <label>Fecha preferida:</label>
                        <input
                            type="date"
                            min={new Date().toISOString().split('T')[0]}
                            value={pref.preferred_date}
                            onChange={(e) => handlePreferenceChange(index, 'preferred_date', e.target.value)}
                        />

                        <label>Tipo:</label>
                        <select
                            value={pref.preferred_type}
                            onChange={(e) => handlePreferenceChange(index, 'preferred_type', e.target.value)}
                        >
                            <option value="morning">Mañana</option>
                            <option value="evening">Tarde</option>
                            <option value="night">Noche</option>
                        </select>

                        <label>Etiqueta:</label>
                        <select
                            value={pref.preferred_label}
                            onChange={(e) => handlePreferenceChange(index, 'preferred_label', e.target.value)}
                        >
                            <option value="regular">Regular</option>
                            <option value="duty">Guardia</option>
                        </select>

                        <button type="button" onClick={() => handleRemovePreference(index)}>🗑 Quitar</button>
                    </div>
                ))}

                {preferences.length < 3 && (
                    <button type="button" onClick={handleAddPreference} style={{ marginTop: '1rem' }}>
                        ➕ Añadir preferencia
                    </button>
                )}

                <br />


                <button type="submit">Publicar Turno</button>
            </form>

            {message && <p>{message}</p>}
            <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
        </div>
    );
};

export default CreateShift;
