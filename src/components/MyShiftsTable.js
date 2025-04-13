import React, { useState, useEffect } from 'react';


const MyShiftsTable = ({
  shifts,
  getSpecialityName,
  receivedSwaps,
  handleSwapAction,
  handleDelete,
  navigate,
}) => {
  const [filtered, setFiltered] = useState(shifts);
  const [filterDate, setFilterDate] = useState('');
  const [filterState, setFilterState] = useState('');


  useEffect(() => {
    let updated = shifts;

    if (filterDate) {
      updated = updated.filter((s) => s.date === filterDate);
    }

    if (filterState) {
      updated = updated.filter((s) => s.state === filterState);
    }

    setFiltered(updated);
  }, [filterDate, filterState, shifts]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterState('');
  };


  return (
    <div>
      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
      />
      <select
        value={filterState}
        onChange={(e) => setFilterState(e.target.value)}
      >
        <option value="">Todos</option>
        <option value="published">Publicado</option>
        <option value="swapped">Intercambiado</option>
        <option value="expired">Expirado</option>
      </select>
      <button onClick={clearFilters}>Limpiar filtros</button>

      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Etiqueta</th>
            <th>Especialidad</th>
            <th>Propuestas intercambio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((shift) => (
            <tr key={shift.shift_id}>
              <td>{shift.date}</td>
              <td>{shift.shift_type}</td>
              <td>{shift.shift_label}</td>
              <td>{getSpecialityName(shift.speciality_id)}</td>
              <td>
                {receivedSwaps
                  .filter((swap) => swap.shift_id === shift.shift_id)
                  .map((swap) => (
                    <div key={swap.swap_id} style={{ marginBottom: '0.5rem' }}>
                      <span>{swap.offered_date || '—'} | {swap.offered_type} | {swap.offered_label}</span>
                      <br />
                      <em>{swap.status}</em>
                      {swap.status === 'proposed' && (
                        <>
                          <br />
                          <button onClick={() => handleSwapAction(swap.swap_id, 'accepted')}>✅</button>
                          <button onClick={() => handleSwapAction(swap.swap_id, 'rejected')}>❌</button>
                        </>
                      )}
                    </div>
                  ))}
              </td>
              <td>{shift.status}</td>
              <td>
                <button onClick={() => navigate(`/shifts/edit/${shift.shift_id}`)}>✏️</button>
                <button onClick={() => handleDelete(shift.shift_id)}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyShiftsTable;
