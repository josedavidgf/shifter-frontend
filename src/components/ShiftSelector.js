import React from 'react';
import SelectorInput from '../components/ui/SelectorInput/SelectorInput';
import { formatFriendlyDate } from '../utils/formatFriendlyDate'; 
import { shiftTypeLabels } from '../utils/labelMaps';

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
    label: `${formatFriendlyDate(shift.date)} de ${shiftTypeLabels[shift.type]}${shift.indicator === 'received' ? ' 🔄' : ''}${shift.preferred ? ' 🟢' : ''}`,
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

export default ShiftSelector;
