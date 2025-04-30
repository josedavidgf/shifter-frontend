// src/components/DayDetails/DayDetailEmpty.jsx
import React from 'react';
import Button from '../../components/ui/Button/Button';
import { Lightning } from '../../theme/icons';

export default function DayDetailEmpty({
  dateStr,
  dayLabel,
  onAddShift,
  onAddPreference,
}) {
  return (
    <div>
      <h3 className="font-bold mb-2">{dayLabel} - Día libre</h3>
      <p className="mb-4">Actualmente no tienes ningún turno ni disponibilidad registrada para este día.</p>

      <div className="btn-group">
        <Button
          label="Añadir turno"
          variant="primary"
          size="lg"
          leftIcon={<Lightning size={20} />}
          rightIcon={<Lightning size={20} />}
          onClick={() => onAddShift(dateStr)}
        />

        <Button
          label="Añadir disponibilidad"
          variant="secondary"
          size="lg"
          leftIcon={<Lightning size={20} />}
          rightIcon={<Lightning size={20} />}
          onClick={() => onAddPreference(dateStr)}
        />
      </div>
    </div>
  );
}
