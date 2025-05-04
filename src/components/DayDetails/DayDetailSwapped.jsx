// src/components/DayDetails/DayDetailSwapped.jsx
import React from 'react';
import Button from '../ui/Button/Button';
import { Lightning } from '../../theme/icons';
import { parseISO, format, isToday } from 'date-fns';
import es from 'date-fns/locale/es';

export default function DayDetailSwapped({
  dateStr,
  dayLabel,
  entry,
  onAddShift,
  onAddPreference,
  navigate,
}) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const parsedDate = parseISO(dateStr);
  const isTodayDate = isToday(parsedDate);
  const displayDay = isTodayDate ? 'Hoy' : capitalize(format(parsedDate, 'EEEE', { locale: es }));
  const dateLabel = `${displayDay}, ${format(parsedDate, 'dd/MM')} - Día libre`;

  // Obtener workerId (ajusta esto según cómo obtienes el id del usuario actual)
  const workerId = entry.worker_id;
  const isRequester = entry.requester_id === workerId;

  console.log('SWAPPED ENTRY:', {
    workerId,
    requester_id: entry.requester_id,
    related_worker: entry.related_worker,
  });

  const name = entry.related_worker_name 
  const surname = entry.related_worker_surname;
  const otherName = name && surname ? `${name} ${surname}` : null;

  return (
    <div>
      <h3 className="font-bold mb-2">{dateLabel}</h3>
      {isRequester ? (
        <p style={{ marginBottom: '16px' }}>
          <span style={{ fontWeight: 600 }}>
            Le cambiaste el turno a {otherName || 'otro trabajador'}
          </span>
          . Hoy no tienes turno ni lo tienes seleccionado como disponible para trabajar.
        </p>
      ) : (
        <p style={{ marginBottom: '16px' }}>
          El {displayDay.toLowerCase()}, {format(parsedDate, 'dd/MM')} tienes turno propio de {entry.shift_type?.toLowerCase()}. Te lo ha cambiado{' '}
          <span style={{ fontWeight: 600 }}>
            {otherName || 'otro trabajador'}
          </span>.
        </p>
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
