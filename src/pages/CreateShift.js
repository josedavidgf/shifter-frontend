import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFullWorkerProfile } from '../services/userService';
import { createShift } from '../services/shiftService';


const CreateShift = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [form, setForm] = useState({
        date: '',
        //start_time: '',
        //end_time: '',
        shift_type: 'morning',
        shift_label: 'regular',
        speciality_id: '',
    });
    const [specialityId, setSpecialityId] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const token = await getToken();
            const profile = await getFullWorkerProfile(token);
            console.log('Perfil del trabajador:', profile);
            console.log('Especialidad del trabajador:', profile.specialityId);
            setSpecialityId(profile.specialityId);
            setForm((prev) => ({ ...prev, speciality_id: profile.specialityId })); // ✅ esto es lo que faltaba

        }
        fetchData();
    }, [getToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev,  [name]: value }));
    };

    const handleSubmit = async (e) => {
        console.log('🧾 Turno a enviar:', form);
        e.preventDefault();
        try {
            const token = await getToken();
            await createShift(form, token);
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
                <input type="date" name="date" value={form.date} onChange={handleChange} required />

                {/* <label>Hora inicio:</label>
        <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required />

        <label>Hora fin:</label>
        <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required /> */}

                <label>Turno:</label>
                <select name="shift_type" value={form.shift_type} onChange={handleChange} required>
                    <option value="morning">Mañana</option>
                    <option value="evening">Tarde</option>
                    <option value="night">Noche</option>
                </select>

                <label>Etiqueta:</label>
                <select name="shift_label" value={form.shift_label} onChange={handleChange} required>
                    <option value="regular">Regular</option>
                    <option value="duty">Guardia</option>
                </select>

                <label>Especialidad:</label>
                <input
                    type="hidden"
                    name="speciality_id"
                    value={form.specialityId}
                />
                <p>{specialityId}</p>



                <button type="submit">Publicar Turno</button>
            </form>

            {message && <p>{message}</p>}
            <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
        </div>
    );
};

export default CreateShift;
