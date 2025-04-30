// src/components/DayDetails/DayDetailSwapped.jsx
import React from 'react';
import Button from '../ui/Button/Button';
import { Lightning } from '../../theme/icons';

export default function DayDetailSwapped({
  dateStr,
  dayLabel,
  entry,
  onAddShift,
  onAddPreference,
  navigate,
}) {
  return (
    <div>
      <h3 className="font-bold mb-2">Turno traspasado</h3>
      <p>Ya no tienes asignado turno este día.</p>

      {entry.related_worker_id && (
        <p><strong>Traspasado a:</strong> {entry.related_worker_name} {entry.related_worker_surname}</p>
      )}

      {entry.swap_id && (
        <Button
          label="Ver intercambio"
          variant="outline"
          size="sm"
          onClick={() => navigate(`/swaps/${entry.swap_id}`)}
        />
      )}

      <div className="btn-group mt-3">
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
