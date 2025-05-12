import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { swapStatusOptions } from '../utils/labelMaps';
import Chip from '../components/ui/Chip/Chip';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import DateRangePicker from '../components/ui/DateRangePicker/DateRangePicker'; // ajusta path si es necesario
import { addDays } from 'date-fns';
import SwapCardContent from '../components/ui/Cards/SwapCardContent';
import { trackEvent } from '../hooks/useTrackPageView';
import { EVENTS } from '../utils/amplitudeEvents';


const MySwapsTable = ({ swaps = [], isLoading, workerId }) => {
  const [filtered, setFiltered] = useState([]);
  const [filterStatuses, setFilterStatuses] = useState([]); // multiselección
  const navigate = useNavigate();
  const [filtersReady, setFiltersReady] = useState(false);
  const today = new Date();
  const [filterRange, setFilterRange] = useState({
    startDate: today,
    endDate: addDays(today, 30)
  });

  useEffect(() => {
    let result = swaps;

    if (filterStatuses.length > 0) {
      result = result.filter((s) => filterStatuses.includes(s.status));
    }


    if (filterRange) {
      result = result.filter(s => {
        const date = new Date(s.shift?.date);
        return date >= filterRange.startDate && date <= filterRange.endDate;
      });
    }

    setFiltered(result);
    if (result.length === 0 && !isLoading) {
      trackEvent(EVENTS.NO_SHIFTS_AVAILABLE_FOR_SWAP);
    }

    setFiltersReady(true);
  }, [filterStatuses, filterRange, swaps]);


  const clearFilters = () => {
    trackEvent(EVENTS.CLEAR_FILTERS_CLICKED);
    setFilterRange({
      startDate: today,
      endDate: addDays(today, 30)
    });
    setFilterStatuses([]);
  };

  return (
    <>
      <div className="filters-container">
        <div className="filters-group">
          <DateRangePicker
            value={filterRange}
            onChange={(range) => {
              setFilterRange(range);
              trackEvent(EVENTS.SWAPS_DATE_RANGE_FILTER_CHANGED, {
                startDate: range.startDate.toISOString().split('T')[0],
                endDate: range.endDate.toISOString().split('T')[0],
              });
            }}

          />
        </div>

        <div className="chip-filter-group">
          <div className="chip-scroll-group">
            {swapStatusOptions.map((option) => {
              const isSelected = filterStatuses.includes(option.value);

              return (

                <Chip
                  key={option.value}
                  label={option.label}
                  selected={filterStatuses.includes(option.value)}
                  onClick={() => {
                    const isSelected = filterStatuses.includes(option.value);
                    const updatedStatuses = isSelected
                      ? filterStatuses.filter((v) => v !== option.value)
                      : [...filterStatuses, option.value];

                    setFilterStatuses(updatedStatuses);

                    // Tracking del cambio de filtro por estado
                    trackEvent(EVENTS.SHIFT_TYPE_FILTER_CHANGED, {
                      selectedStatusesCount: updatedStatuses.length,
                      selectedStatuses: updatedStatuses.join(','),
                    });
                  }}

                />
              );
            })}
          </div>
        </div>

        {/* <Button
            label="Limpiar filtros"
            variant="outline"
            size="lg"
            leftIcon={<Eraser size={16} />}
            onClick={clearFilters}
          /> */}

      </div>
      {/* Ahora sí: no loading aquí, solo empty si de verdad no hay resultados */}
      {!isLoading && filtersReady && filtered.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay intercambios que coincidan con los filtros seleccionados."
          ctaLabel="Limpiar filtros"
          onCtaClick={clearFilters}
        />
      ) : null}

      {!isLoading && filtersReady && filtered.length > 0 && (
        <div className='card-list'>
          {filtered.map((swap) => {
            const iAmRequester = swap.requester_id === workerId;
            const myDate = iAmRequester ? swap.offered_date : swap.shift?.date;
            const myType = iAmRequester ? swap.offered_type : swap.shift?.shift_type;
            const otherDate = iAmRequester ? swap.shift?.date : swap.offered_date;
            const otherType = iAmRequester ? swap.shift?.shift_type : swap.offered_type;
            const otherPersonName = iAmRequester
              ? `${swap.shift?.worker?.name ?? ''} ${swap.shift?.worker?.surname ?? ''}`
              : `${swap.requester?.name ?? ''} ${swap.requester?.surname ?? ''}`;

            return (  // ✅ AÑADIR ESTO
              <div
                key={swap.swap_id}
                className="card-base"
                onClick={() => {
                  trackEvent(EVENTS.SWAP_CARD_CLICKED, {
                    swapId: swap.swap_id,
                    status: swap.status,
                    iAmRequester,
                  });
                  navigate(`/swaps/${swap.swap_id}`);
                }}
              >
                <SwapCardContent
                  otherPersonName={otherPersonName}
                  myDate={myDate}
                  myType={myType}
                  otherDate={otherDate}
                  otherType={otherType}
                  statusLabel={swap.status}
                />
              </div>
            );
          })}

        </div>
      )}

    </>
  );
};

export default MySwapsTable;
