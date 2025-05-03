// src/components/MonthSelector.jsx
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { CaretLeft, CaretRight } from '../theme/icons'; // ✅ Importamos tus iconos


export default function MonthSelector({ selectedMonth, onChange }) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function goToPreviousMonth() {
    const prev = subMonths(parseISO(selectedMonth + '-01'), 1);

    onChange(format(prev, 'yyyy-MM'));
  }

  function goToNextMonth() {
    const next = addMonths(parseISO(selectedMonth + '-01'), 1);
    onChange(format(next, 'yyyy-MM'));
  }

  return (
    <div className="month-selector">
      <button onClick={goToPreviousMonth} className="arrow-button">
        <CaretLeft size={24} /> {/* Icono izquierdo */}
      </button>
      <span className="month-label">
        {capitalize(format(parseISO(selectedMonth + '-01'), 'MMMM', { locale: es }))}

      </span>
      <button onClick={goToNextMonth} className="arrow-button">
        <CaretRight size={24} /> {/* Icono derecho */}
      </button>
    </div>
  );
}