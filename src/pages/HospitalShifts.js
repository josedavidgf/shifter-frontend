import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getHospitalShifts } from '../services/shiftService';
import { getSpecialities } from '../services/specialityService';

const HospitalShifts = () => {
  const { getToken } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getSpecialityName = (id) => {
    const match = specialities.find((s) => s.speciality_id === id);
    return match
      ? `${match.speciality_category} - ${match.speciality_subcategory}`
      : id;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        console.log('🟡 Token:', token);
        const hospitalShifts = await getHospitalShifts(token);
        console.log('🟡 Hospital Shifts:', hospitalShifts);
        const specs = await getSpecialities(token);
        setShifts(hospitalShifts);
        setSpecialities(specs);
      } catch (err) {
        setError('Error al cargar los turnos del hospital');
      }
    }
    fetchData();
  }, [getToken]);

  return (
    <div>
      <h2>Turnos Disponibles en tu Hospital</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shifts.length === 0 ? (
        <p>No hay turnos disponibles en tu hospital.</p>
      ) : (
        <ul>
          {shifts.map((shift) => (
            <li key={shift.shift_id} style={{ marginBottom: '1rem' }}>
              <strong>{shift.date}</strong> | Tipo: {shift.shift_type} | Etiqueta: {shift.shift_label}<br />
              Especialidad: {getSpecialityName(shift.speciality_id)}
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
    </div>
  );
};

export default HospitalShifts;
