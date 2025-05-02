import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import { shiftTypeLabels, swapStatusLabels } from '../utils/labelMaps';
import { Eraser } from '../theme/icons';
import SelectorInput from '../components/ui/SelectorInput/SelectorInput';
import EmptyState from '../components/ui/EmptyState/EmptyState';



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
  const swapStatusOptions = [
    { value: 'proposed', label: 'Propuesto' },
    { value: 'accepted', label: 'Aceptado' },
    { value: 'rejected', label: 'Rechazado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

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
          <SelectorInput
            name="swap_status"
            label="Estado del intercambio"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={swapStatusOptions}
            required
          />
          <Button
            label="Limpiar filtros"
            variant="outline"
            size="lg"
            leftIcon={<Eraser size={16} />}
            onClick={clearFilters}
          />
        </div>
      </div>

      {/* Ahora sí: no loading aquí, solo empty si de verdad no hay resultados */}
      {filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay intercambios que coincidan con los filtros seleccionados."
          ctaLabel="Limpiar filtros"
          onCtaClick={clearFilters}
        />
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
              <strong>Turno objetivo:</strong> {swap.shift?.date} de {shiftTypeLabels[swap.shift?.shift_type]}
              <div className="my-swap-meta">
                <strong>Con:</strong> {swap.shift?.worker?.name} {swap.shift?.worker?.surname}
              </div>
              <div className="my-swap-meta">
                <strong>Ofreces:</strong> {swap.offered_date || '—'} de {shiftTypeLabels[swap.offered_type]}
              </div>
              <span className={`swap-status ${swap.status}`}>
                {swapStatusLabels[swap.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySwapsTable;
