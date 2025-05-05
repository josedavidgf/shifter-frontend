import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button/Button';
import { shiftTypeLabels, swapStatusOptions } from '../utils/labelMaps';
import { Eraser } from '../theme/icons';
import Chip from '../components/ui/Chip/Chip';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import DateRangePicker from '../components/ui/DateRangePicker/DateRangePicker'; // ajusta path si es necesario
import { addDays } from 'date-fns';
import SwapCardContent from '../components/ui/Cards/SwapCardContent';



const MySwapsTable = ({ swaps = [], isLoading }) => {
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
    setFiltersReady(true);
  }, [filterStatuses, filterRange, swaps]);


  const clearFilters = () => {
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
          <DateRangePicker onChange={(range) => setFilterRange(range)} />
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
                    setFilterStatuses((prev) =>
                      prev.includes(option.value)
                        ? prev.filter((v) => v !== option.value) // Deseleccionar
                        : [...prev, option.value]               // Seleccionar
                    );
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
          {filtered.map((swap) => (
            <div
              key={swap.swap_id}
              className="card-base"
              onClick={() => navigate(`/swaps/${swap.swap_id}`)}
            >
              <SwapCardContent
                otherPersonName={`${swap.shift?.worker?.name} ${swap.shift?.worker?.surname}`}
                myDate={swap.offered_date}
                myType={swap.offered_type}
                otherDate={swap.shift?.date}
                otherType={swap.shift?.shift_type}
                statusLabel={swap.status}
              />
            </div>

          ))}
        </div>
      )}

    </>
  );
};

export default MySwapsTable;
