import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import Button from '../components/ui/Button/Button';
import Chip from '../components/ui/Chip/Chip';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import { useToast } from '../hooks/useToast'; // ya lo usas en otras vistas
import { shiftTypeOptions } from '../utils/labelMaps';
import DateRangePicker from '../components/ui/DateRangePicker/DateRangePicker'; // ajusta path si es necesario
import { addDays } from 'date-fns';
import ShiftCardContent from '../components/ui/Cards/ShiftCardContent';
import { trackEvent } from '../hooks/useTrackPageView'; // Importamos trackEvent
import { EVENTS } from '../utils/amplitudeEvents'; // Importamos los eventos

const HospitalShiftsTable = ({ shifts, workerId, sentSwapShiftIds, isLoading }) => {
  const navigate = useNavigate();
  const { showWarning } = useToast();
  const today = new Date();
  const [filterRange, setFilterRange] = useState({
    startDate: today,
    endDate: addDays(today, 30),
  });

  const [filters, setFilters] = useState({
    date: '',
    types: [],
  });

  const [filteredShifts, setFilteredShifts] = useState([]);

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

    // Trackear cuando no hay turnos disponibles
    if (result.length === 0 && !isLoading) {
      trackEvent(EVENTS.NO_SHIFTS_AVAILABLE);
    }
  }, [shifts, filters, filterRange]);

  const clearFilters = () => {
    trackEvent(EVENTS.CLEAR_FILTERS_CLICKED);
    setFilters({ types: [] });
    setFilterRange({
      startDate: today,
      endDate: addDays(today, 30),
    });
  };

  const handleDateRangeChange = (range) => {
    trackEvent(EVENTS.SHIFTS_DATE_RANGE_FILTER_CHANGED, {
      startDate: range.startDate.toISOString().split('T')[0], // Solo la fecha
      endDate: range.endDate.toISOString().split('T')[0], // Solo la fecha
    });
    setFilterRange(range);
  };

  const handleChipClick = (option) => {
    const isSelected = filters.types.includes(option.value);
    const updatedTypes = isSelected
      ? filters.types.filter((v) => v !== option.value)
      : [...filters.types, option.value];

    trackEvent(EVENTS.SHIFT_TYPE_FILTER_CHANGED, {
      selectedTypesCount: updatedTypes.length,
      selectedTypes: updatedTypes.join(','),
    });
    setFilters((prev) => ({
      ...prev,
      types: updatedTypes,
    }));
  };

  const handleShiftClick = (shift, isDisabled, isMine, alreadyProposed) => {
    if (isDisabled) {
      const reason = isMine
        ? 'isMine'
        : alreadyProposed
          ? 'alreadyProposed'
          : 'notPublished';

      trackEvent(EVENTS.SHIFT_CARD_DISABLED_CLICKED, { reason, shiftId: shift.shift_id });
      if (isMine) showWarning('Este turno es tuyo.');
      else if (alreadyProposed) showWarning('Ya has propuesto un intercambio para este turno.');
      else if (shift.state !== 'published') showWarning('Este turno no está disponible.');
    } else {
      trackEvent(EVENTS.SHIFT_CARD_CLICKED, {
        shiftId: shift.shift_id,
        isMine,
        alreadyProposed,
        state: shift.state,
      });
      navigate(`/propose-swap/${shift.shift_id}`);
    }
  };

  return (
    <>
      <div className="filters-container">
        <div className="filters-group">
          <DateRangePicker value={filterRange} onChange={handleDateRangeChange} />
        </div>
        <div className="chip-filter-group">
          <div className="chip-scroll-group">
            {shiftTypeOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                icon={option.icon}
                selected={filters.types.includes(option.value)}
                onClick={() => handleChipClick(option)}
              />
            ))}
          </div>
        </div>
      </div>
      {!isLoading && filteredShifts.length === 0 ? (
        <EmptyState
          title="Sin turnos disponibles"
          description="No hay turnos que coincidan con los filtros seleccionados."
          ctaLabel="Limpiar filtros"
          onCtaClick={clearFilters}
        />
      ) : null}
      {!isLoading && filteredShifts.length > 0 && (
        <div className="card-list">
          {filteredShifts.map((shift) => {
            const isMine = shift.worker_id === workerId;
            const alreadyProposed = sentSwapShiftIds.includes(shift.shift_id);
            const isDisabled = isMine || shift.state !== 'published' || alreadyProposed;

            return (
              <div
                key={shift.shift_id}
                className={`card-base ${isDisabled ? 'disabled' : ''}`}
                onClick={() => handleShiftClick(shift, isDisabled, isMine, alreadyProposed)}
              >
                <ShiftCardContent
                  date={shift.date}
                  type={shift.shift_type}
                  workerName={`${shift.worker?.name} ${shift.worker?.surname}`}
                  swapsAccepted={shift.worker?.swapsAcceptedAsPublisher ?? 0}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default HospitalShiftsTable;
