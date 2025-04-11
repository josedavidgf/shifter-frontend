import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyShifts } from '../services/shiftService';
import { getSpecialities } from '../services/specialityService';


const MyShifts = () => {
  const { getToken } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState(null);
  const [specialities, setSpecialities] = useState([]);
  const navigate = useNavigate();

  const getSpecialityName = (id) => {
    const match = specialities.find((s) => s.speciality_id === id);
    return match
      ? `${match.speciality_category} - ${match.speciality_subcategory}`
      : id;
  };
  

  useEffect(() => {
    async function fetchShifts() {
      try {

        const token = await getToken();
        const response = await getMyShifts(token);
        const specs = await getSpecialities(token); // si es protegido
        setShifts(response);
        setSpecialities(specs);
      } catch (err) {
        console.error('❌ Error al cargar turnos:', err.message);
        setError('No se pudieron cargar los turnos');
      }
    }
    fetchShifts();
  }, [getToken]);

  return (
    <div>
      <h2>Mis Turnos Publicados</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {shifts.length === 0 ? (
        <p>No tienes turnos publicados aún.</p>
      ) : (
        <ul>
          {shifts.map((shift) => (
            <li key={shift.shift_id} style={{ marginBottom: '1rem' }}>
              <strong>{shift.date}</strong> | Tipo: {shift.shift_type} | Etiqueta: {shift.shift_label}<br />
              Especialidad: {getSpecialityName(shift.speciality_id)}
              <button onClick={() => navigate(`/shifts/edit/${shift.shift_id}`)}>✏️ Editar</button> 
            </li>
          ))}
        </ul>
      )}

      <button onClick={() => navigate('/dashboard')}>⬅ Volver al Dashboard</button>
    </div>
  );
};

export default MyShifts;
