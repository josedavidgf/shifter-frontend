import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import es from 'date-fns/locale/es';

// Utils para formatear fechas
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import Chip from '../../../components/ui/Chip/Chip';
import { Calendar } from '../../../theme/icons';
import InputField from '../../../components/ui/InputField/InputField';
import { useRef, useEffect } from 'react';


const DateRangePicker = ({ onChange }) => {
  const [visible, setVisible] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const [range, setRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    key: 'selection',
  });

  const [selectedQuickRange, setSelectedQuickRange] = useState(null);

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    setRange({ ...range, startDate, endDate });

    const start = startDate?.toDateString();
    const end = endDate?.toDateString();

    if (start && end && start !== end) {
      onChange({ startDate, endDate }); // aplicar filtro solo cuando haya selección completa
      setVisible(false);
      setSelectedQuickRange(null);
    }
  };



  const quickRanges = [
    {
      key: 'today',
      label: 'Hoy',
      action: () => {
        const today = new Date();
        setRange({ startDate: today, endDate: today, key: 'selection' });
        onChange({ startDate: today, endDate: today });
        setVisible(false);
        setSelectedQuickRange('today');
      },
    },
    {
      key: 'week',
      label: 'Esta semana',
      action: () => {
        const start = startOfWeek(new Date(), { weekStartsOn: 1 });
        const end = endOfWeek(new Date(), { weekStartsOn: 1 });
        setRange({ startDate: start, endDate: end, key: 'selection' });
        onChange({ startDate: start, endDate: end });
        setVisible(false);
        setSelectedQuickRange('week');
      },
    },
    {
      key: 'month',
      label: 'Este mes',
      action: () => {
        const start = startOfMonth(new Date());
        const end = endOfMonth(new Date());
        setRange({ startDate: start, endDate: end, key: 'selection' });
        onChange({ startDate: start, endDate: end });
        setVisible(false);
        setSelectedQuickRange('month');
      },
    },
  ];

  return (
    <div className="date-range-wrapper" ref={wrapperRef}>
      <div onClick={() => setVisible(!visible)}>
        <InputField
          name="date-range"
          label="Rango de fechas"
          value={`${format(range.startDate, 'dd/MM')} – ${format(range.endDate, 'dd/MM')}`}
          readOnly
          rightIcon={<Calendar size={18} />}
        />
      </div>

      {visible && (
        <div className="date-range-popup">
          <div className="quick-range-buttons">
            {quickRanges.map(({ key, label, action }) => (
              <Chip
                key={key}
                label={label}
                selected={selectedQuickRange === key}
                onClick={action}
              />
            ))}
          </div>

          <DateRange
            ranges={[range]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            rangeColors={["#4E7CFF"]}
            showDateDisplay={false}
            editableDateInputs={true}
            locale={es}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;