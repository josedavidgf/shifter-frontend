// src/components/MonthSelector.jsx
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import { CaretLeft, CaretRight } from '../theme/icons'; // ✅ Importamos tus iconos
import { trackEvent } from '../hooks/useTrackPageView'; // Importamos trackEvent
import { EVENTS } from '../utils/amplitudeEvents'; // Importamos los eventos

export default function MonthSelector({ selectedMonth, onChange }) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function goToPreviousMonth() {
    const prev = subMonths(parseISO(selectedMonth + '-01'), 1);
    trackEvent(EVENTS.PREV_MONTH_CLICKED, { currentMonth: selectedMonth, newMonth: format(prev, 'yyyy-MM') }); // Trackeamos el evento
    onChange(format(prev, 'yyyy-MM'));
  }

  function goToNextMonth() {
    const next = addMonths(parseISO(selectedMonth + '-01'), 1);
    trackEvent(EVENTS.NEXT_MONTH_CLICKED, { currentMonth: selectedMonth, newMonth: format(next, 'yyyy-MM') }); // Trackeamos el evento
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