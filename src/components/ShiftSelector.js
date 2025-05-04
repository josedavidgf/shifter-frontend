import React from 'react';
import SelectorInput from '../components/ui/SelectorInput/SelectorInput'; // Ajusta ruta si necesario
import { formatFriendlyDate } from '../utils/formatFriendlyDate'; // Ajusta path si necesario


function ShiftSelector({ shifts, selectedShiftId, onSelect }) {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedShift = shifts.find(shift => shift.id === selectedId);
    if (selectedShift) {
      onSelect(selectedShift);
    }
  };

  const options = shifts.map((shift) => ({
    value: shift.id,
    label: `${formatFriendlyDate(shift.date)} de ${translateType(shift.type)}${shift.indicator === 'received' ? ' ↓' : ''}${shift.preferred ? ' 🟢' : ''}`,
  }));

  return (
      <SelectorInput
        name="shift"
        label="Turno que ofreces"
        value={selectedShiftId}
        onChange={handleChange}
        options={options}
        required
      />
  );
}

function translateType(type) {
  switch (type) {
    case 'morning':
      return 'Mañana';
    case 'evening':
      return 'Tarde';
    case 'night':
      return 'Noche';
    default:
      return type;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default ShiftSelector;
