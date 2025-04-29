import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';


const MySwapsTable = ({ swaps = [] }) => {
  const [filtered, setFiltered] = useState([]);
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [filterStatus, setFilterStatus] = useState('proposed'); // ⬅️ Default
  const [filterDate, setFilterDate] = useState(currentMonth);   // ⬅️ Default
  const navigate = useNavigate();

  useEffect(() => {
    let result = swaps;

    if (filterStatus) {
      result = result.filter(s => s.status === filterStatus);
    }

    if (filterDate) {
      result = result.filter(s => {
        const shiftMonth = s.shift?.date?.slice(0, 7); // YYYY-MM
        return shiftMonth === filterDate;
      });
    }

    setFiltered(result);
  }, [filterStatus, filterDate, swaps]);

  const clearFilters = () => {
    setFilterDate('');
    setFilterStatus('');
  };

  return (
    <div>
      <div className="filters-container">
        <div className="filters-group">
          <input
            type="month"
            className="filter-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="proposed">Propuesto</option>
            <option value="accepted">Aceptado</option>
            <option value="rejected">Rechazado</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <Button
            label="Limpiar filtros"
            variant="outline"
            size="lg"
            onClick={clearFilters}
          />
        </div>
      </div>

      {/* Ahora sí: no loading aquí, solo empty si de verdad no hay resultados */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          No tienes intercambios en esta búsqueda.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((swap) => (
            <div
              key={swap.swap_id}
              className="my-swap-card"
              onClick={() => navigate(`/swaps/${swap.swap_id}`)}
            >
              {/* Card del swap */}
              <div className="my-swap-meta">
                {swap.direction === 'sent' ? 'Propuesto por ti' : 'Propuesta recibida'}
              </div>
              <strong>Turno objetivo: {swap.shift?.date} · {swap.shift?.shift_type}</strong>
              <div className="my-swap-meta">
                Con: {swap.shift?.worker?.name} {swap.shift?.worker?.surname}
              </div>
              <div className="my-swap-meta">
                Ofreces: {swap.offered_date || '—'} · {swap.offered_type}
              </div>
              <span className={`swap-status ${swap.status}`}>
                {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySwapsTable;
