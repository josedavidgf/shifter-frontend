import React from 'react';
import GptShiftsChat from '../../components/GptShiftsChat';

const ShiftsAssistant = () => {
  // Datos simulados (puedes cambiarlos luego por los reales)
  const shifts = [
    { date: '2025-05-01', shift_type: 'mañana' },
    { date: '2025-05-02', shift_type: 'noche' },
    { date: '2025-05-03', shift_type: 'libre' },
    { date: '2025-05-04', shift_type: 'mañana' }
  ];

  const calendarData = shifts
    .map((t) => {
      const [, , day] = t.date.split('-'); // ← solo usamos el día
      return `${day} mayo: ${t.shift_type}`;
    })
    .join('\n');

  return (
    <div style={{ padding: '2rem' }}>
      <GptShiftsChat calendarData={calendarData} />
    </div>
  );
};

export default ShiftsAssistant;