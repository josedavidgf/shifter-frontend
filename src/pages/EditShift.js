import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    getShiftById,
    updateShift,
    getShiftPreferencesByShiftId,
    updateShiftPreferences
} from '../services/shiftService';

const EditShift = () => {
    const { id } = useParams();
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: '',
        shift_type: '',
        shift_label: '',
    });

    const [preferences, setPreferences] = useState([]);

    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchShift() {
            try {
                const token = await getToken();
                const data = await getShiftById(id, token);
                setForm({
                    date: data.date || '',
                    shift_type: data.shift_type || '',
                    shift_label: data.shift_label || '',
                });
                const prefs = await getShiftPreferencesByShiftId(id, token);
                setPreferences(prefs);
            } catch (err) {
                console.error('❌ Error al cargar turno:', err.message);
                setError('Error al cargar el turno.');
            }
        }
        fetchShift();
    }, [id, getToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    const handlePreferenceChange = (index, field, value) => {
        const updated = [...preferences];
        updated[index][field] = value;
        setPreferences(updated);
    };
    const handleAddPreference = () => {
        if (preferences.length >= 3) return;
        setPreferences([...preferences, { preferred_date: '', preferred_type: 'morning', preferred_label: 'regular' }]);
    };

    const handleRemovePreference = (index) => {
        setPreferences(preferences.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            await updateShift(id, form, token);
            await updateShiftPreferences(id, preferences, token);
            navigate('/shifts/my');
        } catch (err) {
            console.error('❌ Error al actualizar turno:', err.message);
            setError('No se pudo actualizar el turno.');
        }
    };

    return (
        <div>
            <h2>Editar Turno</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Fecha:</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} required />

                <label>Tipo de turno:</label>
                <select name="shift_type" value={form.shift_type} onChange={handleChange} required>
                    <option value="">Selecciona</option>
                    <option value="morning">Mañana</option>
                    <option value="evening">Tarde</option>
                    <option value="night">Noche</option>
                </select>

                <label>Etiqueta:</label>
                <select name="shift_label" value={form.shift_label} onChange={handleChange} required>
                    <option value="">Selecciona</option>
                    <option value="regular">Regular</option>
                    <option value="duty">Guardia</option>
                </select>

                <h3>Preferencias de intercambio</h3>
                {preferences.map((pref, index) => (
                    <div key={index} style={{ border: '1px solid #ccc', marginTop: '1rem', padding: '0.5rem' }}>
                        <strong>Preferencia {index + 1}</strong>
                        <br />
                        <label>Fecha preferida:</label>
                        <input
                            type="date"
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

                <button type="submit">💾 Guardar cambios</button>
                <button type="button" onClick={() => navigate('/shifts/my')}>⬅ Cancelar</button>
            </form>
        </div>
    );
};

export default EditShift;
