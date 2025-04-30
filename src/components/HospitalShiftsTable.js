import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import { shiftTypeLabels,swapStatusLabels,shiftStatusLabels } from '../utils/labelMaps';


const HospitalShiftsTable = ({ shifts, workerId, sentSwapShiftIds }) => {
  const navigate = useNavigate();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const [filters, setFilters] = useState({
    date: currentMonth,
    type: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      date: '',
      type: ''
    });
  };


  const filteredShifts = shifts
    .filter((shift) => {
      return (
        (!filters.date || shift.date.slice(0, 7) === filters.date) &&
        (!filters.type || shift.shift_type === filters.type)
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));



  return (
    <div>
      <div className="filters-container">
        <div className="filters-group">
          <input
            type="month"
            className="filter-input"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />

          <select className="filter-select" name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">Todos los tipos</option>
            <option value="morning">Mañana</option>
            <option value="evening">Tarde</option>
            <option value="night">Noche</option>
          </select>

          <Button
            label="Limpiar filtros"
            variant="outline"
            size="lg"
            onClick={clearFilters}
          />
        </div>
      </div>
      {filteredShifts.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          No hay turnos que coincidan con tu búsqueda.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredShifts.map((shift) => {
            const isMine = shift.worker_id === workerId;
            const alreadyProposed = sentSwapShiftIds.includes(shift.shift_id);
            const isDisabled = isMine || shift.state !== 'published' || alreadyProposed;

            return (
              <div
                key={shift.shift_id}
                className={`shift-card ${isDisabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!isDisabled) navigate(`/propose-swap/${shift.shift_id}`);
                }}
              >
                <div className="shift-info">
                  <div className="shift-date">{shift.date} de {shiftTypeLabels[shift.shift_type]}</div>
                  <div>{shift.worker?.name} {shift.worker?.surname}</div>
                  <div className="shift-meta">
                    Intercambios aceptados: {shift.worker?.swapsAcceptedAsPublisher ?? 0}
                  </div>
                </div>

                {alreadyProposed && (
                  <span className="shift-status">Intercambio propuesto</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div >
  );
};

export default HospitalShiftsTable;
