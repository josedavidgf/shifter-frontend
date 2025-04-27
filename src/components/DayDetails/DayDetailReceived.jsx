// src/components/DayDetails/DayDetailReceived.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía
import { Lightning } from '../../theme/icons';

export default function DayDetailReceived({
  dateStr,
  entry,
  dayLabel,
  navigate,
}) {
  return (
    <div>
      <h3 className="font-bold mb-2">{dayLabel} - Turno recibido</h3>
      <p>Tipo de turno: {entry.shift_type}</p>
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
