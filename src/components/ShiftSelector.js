// src/components/ShiftSelector.js
import React from 'react';

function ShiftSelector({ shifts, onSelect }) {

  const handleChange = (e) => {
    const selectedShiftId = e.target.value;
    const selectedShift = shifts.find(shift => shift.id === selectedShiftId);
    if (selectedShift) {
      onSelect(selectedShift);
    }
  };

  return (
    <div>
      <label>Turno que ofreces:</label>
      <select onChange={handleChange} defaultValue="">
        <option value="" disabled>Selecciona un turno</option>
        {shifts.map((shift) => (
          <option key={shift.id} value={shift.id}>
            {formatDate(shift.date)} - {translateType(shift.type)}
            {shift.indicator === 'received' ? ' ✅' : ''}
          </option>
        ))}
      </select>
    </div>
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
