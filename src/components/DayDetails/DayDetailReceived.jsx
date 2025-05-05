// src/components/DayDetails/DayDetailReceived.jsx
import React from 'react';
import Button from '../ui/Button/Button';
import { Lightning, Eye } from '../../theme/icons';
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

  const getShiftBackground = (type) => {
    switch (type) {
      case 'morning':
        return 'rgba(255, 249, 219, 0.6)';
      case 'evening':
      case 'afternoon':
        return 'rgba(255, 226, 235, 0.6)';
      case 'night':
        return 'rgba(229, 234, 255, 0.6)';
      case 'reinforcement':
        return 'rgba(255, 214, 194, 0.6)';
      default:
        return 'rgba(240, 240, 240, 0.6)';
    }
  };

  return (
    <div style={{ borderRadius: '12px', backgroundColor: getShiftBackground(entry.shift_type) }}>
      <div style={{ padding: '16px' }}>
        <h3 className="font-bold mb-2">
          {`${displayDay}, ${format(parsedDate, 'dd/MM')} - Turno recibido`}
        </h3>

        <p className="mb-4">
          El {displayDay.toLowerCase()}, {format(parsedDate, 'dd/MM')} tienes turno recibido de {shiftTypeLabels[entry.shift_type].toLowerCase()}
          {entry.shift_type === 'morning' && ' de 8:00 a 15:00'}
          {entry.shift_type === 'afternoon' && ' de 15:00 a 22:00'}
          {entry.shift_type === 'night' && ' de 22:00 a 08:00'}. Te lo ha cambiado{' '}
          <span style={{ fontWeight: 600 }}>
            {entry.related_worker_name} {entry.related_worker_surname}
          </span>.
        </p>
        <Button
          label="Publicar turno recibido"
          variant="primary"
          size="lg"
          leftIcon={<Lightning size={20} />}
          onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
        />
        
        {entry.swap_id && (
          <Button
            label="Ver detalles"
            variant="ghost"
            leftIcon={<Eye size={20} />}
            size="lg"
            onClick={() => navigate(`/swaps/${entry.swap_id}`)}
          />
        )}
      </div>
    </div>
  );
}
