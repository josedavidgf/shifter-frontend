// src/components/DayDetails/DayDetailPreference.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía
import { shiftTypeLabels } from '../../utils/labelMaps';
import { parseISO, format, isToday } from 'date-fns';
import es from 'date-fns/locale/es';

export default function DayDetailPreference({
  dateStr,
  entry,
  dayLabel,
  onEditPreference,
  onDeletePreference,
  loadingDeletePreference
}) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const parsedDate = parseISO(dateStr);
  const isTodayDate = isToday(parsedDate);
  const displayDay = isTodayDate ? 'Hoy' : capitalize(format(parsedDate, 'EEEE', { locale: es }));
  const dateLabel = `${displayDay}, ${format(parsedDate, 'dd/MM')} - Día libre (disponible)`;

  return (
    <div>
      <h3 className="font-bold mb-2">{dateLabel}</h3>
      <p style={{ marginBottom: '16px' }}>
        {isTodayDate
          ? <>Hoy no tienes turno. <span style={{ fontWeight: 600 }}>Lo tienes marcado como disponible para cambiar.</span></>
          : <>El {dayLabel.toLowerCase()} no tienes turno. <span style={{ fontWeight: 600 }}>Lo tienes marcado como disponible para cambiar.</span></>}
      </p>
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
          isLoading={loadingDeletePreference}
          disabled={loadingDeletePreference}
        />
      </div>
    </div>
  );
}
