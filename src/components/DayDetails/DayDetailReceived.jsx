// src/components/DayDetails/DayDetailReceived.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía
import { Lightning } from '../../theme/icons';
import { shiftTypeLabels } from '../../utils/labelMaps';

export default function DayDetailReceived({
  dateStr,
  entry,
  dayLabel,
  navigate,
}) {
  return (
    <div>
      <h3 className="font-bold mb-2">Turno recibido</h3>
      <p>Turno: {dayLabel} de {shiftTypeLabels[entry.shift_type]}</p>
      <p>Propietario original: {entry.requester_name} {entry.requester_surname}</p>

      <Button
        label="Publicar turno recibido"
        variant="primary"
        size="lg"
        leftIcon={<Lightning size={20} />}
        rightIcon={<Lightning size={20} />}
        onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
      />
    </div>
  );
}
