// src/components/DayDetails/DayDetailPreference.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía

export default function DayDetailPreference({
  dateStr,
  entry,
  dayLabel,
  onEditPreference,
  onDeletePreference
}) {
  return (
    <div>
      <h3 className="font-bold mb-2">{dayLabel} - Disponibilidad</h3>
      <p>Tipo de disponibilidad: {entry.preference_type}</p>
      <div className="btn-group">
        <Button
          label="Editar disponibilidad"
          variant="outline"
          size="md"
          onClick={() => onEditPreference(dateStr)}
        />
        <Button
          label="Eliminar disponibilidad"
          variant="danger"
          size="md"
          onClick={() => onDeletePreference(dateStr)}
          style={{ marginTop: '1rem' }}
        />
      </div>
    </div>
  );
}
