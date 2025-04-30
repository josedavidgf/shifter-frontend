import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import { shiftTypeLabels, swapStatusLabels, shiftStatusLabels } from '../utils/labelMaps';
import SelectorInput from '../components/ui/SelectorInput/SelectorInput';
import { Eraser } from '../theme/icons';


const HospitalShiftsTable = ({ shifts, workerId, sentSwapShiftIds }) => {
  const navigate = useNavigate();
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const [filters, setFilters] = useState({
    date: currentMonth,
    type: ''
  });

  const handleFilterDateChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectorChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  

  const clearFilters = () => {
    setFilters({
      date: '',
      type: ''
    });
  };
  const shiftTypeOptions = [
    { value: 'morning', label: 'Mañana' },
    { value: 'evening', label: 'Tarde' },
    { value: 'night', label: 'Noche' },
    { value: 'reinforcement', label: 'Refuerzo' },
  ];

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
            onChange={handleFilterDateChange}
          />
          <SelectorInput
            name="shift_type"
            label="Tipo de turno"
            value={filters.type}
            onChange={(e) => handleSelectorChange('type', e.target.value)}
            options={shiftTypeOptions}
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
