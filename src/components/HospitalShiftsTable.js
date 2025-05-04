import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import Button from '../components/ui/Button/Button';
import { shiftTypeLabels } from '../utils/labelMaps';
import Chip from '../components/ui/Chip/Chip';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import { useToast } from '../hooks/useToast'; // ya lo usas en otras vistas
import { Sun, SunHorizon, Moon, ShieldCheck, } from '../theme/icons';
import DateRangePicker from '../components/ui/DateRangePicker/DateRangePicker'; // ajusta path si es necesario
import { addDays } from 'date-fns';


const HospitalShiftsTable = ({ shifts, workerId, sentSwapShiftIds, isLoading }) => {
  const navigate = useNavigate();
  const { showWarning } = useToast();
  const [filtersReady, setFiltersReady] = useState(false);
  const today = new Date();
  const [filterRange, setFilterRange] = useState({
    startDate: today,
    endDate: addDays(today, 30)
  });


  const [filters, setFilters] = useState({
    date: '',
    types: []
  });

  useEffect(() => {
    const result = shifts
      .filter((shift) => {
        const date = new Date(shift.date);
        const inRange = date >= filterRange.startDate && date <= filterRange.endDate;

        return (
          inRange &&
          (filters.types.length === 0 || filters.types.includes(shift.shift_type))
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredShifts(result);
    setFiltersReady(true);
  }, [shifts, filters, filterRange]);




  /*   const handleFilterDateChange = (e) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
    }; */

  const clearFilters = () => {
    setFilters({ types: [] });
    setFilterRange({
      startDate: today,
      endDate: addDays(today, 30)
    });
  };

  const shiftTypeOptions = [
    { value: 'morning', label: 'Mañana', icon: Sun },
    { value: 'evening', label: 'Tarde', icon: SunHorizon },
    { value: 'night', label: 'Noche', icon: Moon },
    { value: 'reinforcement', label: 'Refuerzo', icon: ShieldCheck },
  ];

  const [filteredShifts, setFilteredShifts] = useState([]);

  useEffect(() => {
    const result = shifts
      .filter((shift) => {
        return (
/*           (!filters.date || shift.date.slice(0, 7) === filters.date) &&
 */          (filters.types.length === 0 || filters.types.includes(shift.shift_type))
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setFilteredShifts(result);
    setFiltersReady(true);
  }, [shifts, filters]);




  return (
    <div>
      <div className="filters-container">
        <div className="filters-group">
          <DateRangePicker onChange={(range) => setFilterRange(range)} />

          <div className="chip-filter-group">
            {shiftTypeOptions.map((option) => {
              const isSelected = filters.types.includes(option.value);
              return (
                <Chip
                  key={option.value}
                  label={option.label}
                  icon={option.icon}
                  selected={isSelected}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      types: isSelected
                        ? prev.types.filter((v) => v !== option.value)
                        : [...prev.types, option.value]
                    }))
                  }
                />
              );
            })}
          </div>

          {/*           <Button
            label="Limpiar filtros"
            variant="outline"
            size="lg"
            leftIcon={<Eraser size={16} />}
            onClick={clearFilters}
          /> */}
        </div>
      </div>
      {!isLoading && filtersReady && filteredShifts.length === 0 ? (
        <EmptyState
          title="Sin turnos disponibles"
          description="No hay turnos que coincidan con los filtros seleccionados."
          ctaLabel="Limpiar filtros"
          onCtaClick={clearFilters}
        />
      ) : null}
      {!isLoading && filtersReady && filteredShifts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredShifts.map((shift) => {
            const isMine = shift.worker_id === workerId;
            const alreadyProposed = sentSwapShiftIds.includes(shift.shift_id);
            const isDisabled = isMine || shift.state !== 'published' || alreadyProposed;

            const handleClick = () => {
              if (isDisabled) {
                if (isMine) showWarning('Este turno es tuyo.');
                else if (alreadyProposed) showWarning('Ya has propuesto un intercambio para este turno.');
                else if (shift.state !== 'published') showWarning('Este turno no está disponible.');
              } else {
                navigate(`/propose-swap/${shift.shift_id}`);
              }
            };

            return (
              <div
                key={shift.shift_id}
                className={`shift-card ${isDisabled ? 'disabled' : ''}`}
                onClick={handleClick}
              >
                <div className="shift-info">
                  <div className="shift-date">{shift.date} de {shiftTypeLabels[shift.shift_type]}</div>
                  <div>{shift.worker?.name} {shift.worker?.surname}</div>
                  <div className="shift-meta">
                    Intercambios aceptados: {shift.worker?.swapsAcceptedAsPublisher ?? 0}
                  </div>
                </div>

                {isMine && <span className="shift-status">Tu turno</span>}
                {alreadyProposed && <span className="shift-status">Intercambio ya propuesto</span>}
                {shift.state !== 'published' && <span className="shift-status">No disponible</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HospitalShiftsTable;
