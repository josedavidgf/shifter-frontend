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
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [filterState, setFilterState] = useState('published');


  useEffect(() => {
    let updated = shifts;

    if (filterMonth) {
      updated = updated.filter((s) => {
        const [year, month] = s.date.split('-');
        return `${year}-${month}` === filterMonth;
      });
    }

    if (filterState) {
      updated = updated.filter((s) => s.state === filterState);
    }
    updated = updated.sort((a, b) => new Date(a.date) - new Date(b.date));


    setFiltered(updated);
  }, [filterMonth, filterState, shifts]);

  const clearFilters = () => {
    setFilterMonth('');
    setFilterState('');
  };


  return (
    <div>
      <input
        type="month"
        value={filterMonth}
        onChange={(e) => setFilterMonth(e.target.value)}
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
              <td>{shift.state}</td>
              <td>
                <button onClick={() => navigate(`/shifts/edit/${shift.shift_id}`)}>✏️</button>
                <button onClick={() => navigate(`/shifts/${shift.shift_id}`)}>🔍 Ver detalle</button>
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
