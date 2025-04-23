// src/components/MonthSelector.jsx
import { format, addMonths, subMonths, parseISO } from 'date-fns';
import es from 'date-fns/locale/es';
import '../index.css';

export default function MonthSelector({ selectedMonth, onChange }) {
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
      <button onClick={goToPreviousMonth} className="arrow-button">◀</button>
      <span className="month-label">
        {format(parseISO(selectedMonth + '-01'), 'MMMM yyyy', { locale: es })}
      </span>
      <button onClick={goToNextMonth} className="arrow-button">▶</button>
    </div>
  );
}