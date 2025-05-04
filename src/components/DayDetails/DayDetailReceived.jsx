// src/components/DayDetails/DayDetailReceived.jsx
import React from 'react';
import Button from '../ui/Button/Button';
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
      {entry.related_worker_id && (
        <p><strong>Cedido por:</strong> {entry.related_worker_name} {entry.related_worker_surname}</p>
      )}

      <Button
        label="Publicar turno recibido"
        variant="primary"
        size="lg"
        leftIcon={<Lightning size={20} />}
        rightIcon={<Lightning size={20} />}
        onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
      />
      
      {entry.swap_id && (
        <Button
          label="Ver detalles"
          variant="ghost"
          leftIcon={<Lightning size={20} />}
          size="lg"
          onClick={() => navigate(`/swaps/${entry.swap_id}`)}
        />
      )}
    </div>
  );
}
