// src/components/DayDetails/DayDetailReceived.jsx
import React from 'react';
import Button from '../ui/Button/Button';
import { Lightning } from '../../theme/icons';
import { shiftTypeLabels } from '../../utils/labelMaps';
import { parseISO, format } from 'date-fns';
import es from 'date-fns/locale/es';

export default function DayDetailReceived({
  dateStr,
  entry,
  dayLabel,
  navigate,
}) {
  const parsedDate = parseISO(dateStr);
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const displayDay = capitalize(format(parsedDate, 'EEEE', { locale: es }));

  return (
    <div>
      <h3 className="font-bold mb-2">
        {`${displayDay}, ${format(parsedDate, 'dd/MM')} - Turno recibido`}
      </h3>

      <p className="mb-4">
        El {displayDay.toLowerCase()}, {format(parsedDate, 'dd/MM')} tienes turno recibido de {shiftTypeLabels[entry.shift_type].toLowerCase()}. Te lo ha cambiado{' '}
        <span style={{ fontWeight: 600 }}>
          {entry.related_worker_name} {entry.related_worker_surname}
        </span>.
      </p>
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
