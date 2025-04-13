import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HospitalShiftsTable = ({ shifts, specialities, workerId, sentSwapShiftIds }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    date: '',
    type: '',
    label: '',
    speciality: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      type: '',
      label: '',
      speciality: ''
    });
  };

  const getSpecialityName = (id) => {
    const match = specialities.find((s) => s.speciality_id === id);
    return match ? `${match.speciality_category} - ${match.speciality_subcategory}` : id;
  };

  const filteredShifts = shifts
    .filter((shift) => {
      return (
        (!filters.date || shift.date === filters.date) &&
        (!filters.type || shift.shift_type === filters.type) &&
        (!filters.label || shift.shift_label === filters.label) &&
        (!filters.speciality || shift.speciality_id === filters.speciality)
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <h3>Filtrar turnos</h3>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
        />

        <select name="type" value={filters.type} onChange={handleFilterChange}>
          <option value="">Todos los tipos</option>
          <option value="morning">Mañana</option>
          <option value="evening">Tarde</option>
          <option value="night">Noche</option>
        </select>

        <select name="label" value={filters.label} onChange={handleFilterChange}>
          <option value="">Todas las etiquetas</option>
          <option value="regular">Regular</option>
          <option value="duty">Guardia</option>
        </select>

        <select name="speciality" value={filters.speciality} onChange={handleFilterChange}>
          <option value="">Todas las especialidades</option>
          {specialities.map((s) => (
            <option key={s.speciality_id} value={s.speciality_id}>
              {s.speciality_category} - {s.speciality_subcategory}
            </option>
          ))}
        </select>

        <button onClick={clearFilters}>Limpiar filtros</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Tipo</th>
            <th>Etiqueta</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredShifts.map((shift) => (
            <tr key={shift.shift_id}>
              <td>{shift.date}</td>
              <td>{shift.worker?.name || '-'}</td>
              <td>{shift.worker?.surname || '-'}</td>
              <td>{shift.shift_type}</td>
              <td>{shift.shift_label}</td>
              <td>{getSpecialityName(shift.speciality_id)}</td>
              <td>
                {shift.worker_id !== workerId && shift.state === 'published' && (
                  <button
                    onClick={() => navigate(`/propose-swap/${shift.shift_id}`)}
                    disabled={sentSwapShiftIds.includes(shift.shift_id)}
                  >
                    {sentSwapShiftIds.includes(shift.shift_id)
                      ? 'Intercambio propuesto'
                      : 'Proponer intercambio'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HospitalShiftsTable;
