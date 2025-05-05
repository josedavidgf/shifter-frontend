// src/components/DayDetails/DayDetailSwapped.jsx
import React from 'react';
import Button from '../ui/Button/Button';
import { Lightning, Lightbulb, Eye } from '../../theme/icons';
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

  const getShiftBackground = () => 'rgba(245, 246, 248, 0.8)';

  return (
    <div style={{ borderRadius: '12px', backgroundColor: getShiftBackground() }}>
      <div style={{ padding: '16px' }}>
        <h3 className="font-bold mb-2">{dateLabel}</h3>
        {!isRequester ? (
          <p style={{ marginBottom: '16px' }}>
            Le cambiaste el turno a <span style={{ fontWeight: 600 }}>{otherName || 'otro trabajador'}</span>. Hoy no tienes turno ni lo tienes seleccionado como disponible para trabajar. Tu turno era de {entry.shift_type === 'morning' && 'mañana'}
            {entry.shift_type === 'evening' && 'tarde'}
            {entry.shift_type === 'night' && 'noche'}.
          </p>
        ) : (
          <p style={{ marginBottom: '16px' }}>
            El {displayDay.toLowerCase()}, {format(parsedDate, 'dd/MM')} tienes turno propio de {entry.shift_type?.toLowerCase()}
            {entry.shift_type === 'morning' && ' de 8:00 a 15:00'}
            {entry.shift_type === 'evening' && ' de 15:00 a 22:00'}
            {entry.shift_type === 'night' && ' de 22:00 a 08:00'}. Te lo ha cambiado{' '}
            <span style={{ fontWeight: 600 }}>
              {otherName || 'otro trabajador'}
            </span>.
          </p>
        )}

        <div className="btn-group mt-3">
          <Button
            label="Añadir turno"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} />}
            onClick={() => onAddShift(dateStr)}
          />

          <Button
            label="Añadir disponibilidad"
            variant="secondary"
            size="lg"
            leftIcon={<Lightbulb size={20} />}
            onClick={() => onAddPreference(dateStr)}
          />
        </div>

        {entry.swap_id && (
          <Button
            label="Ver detalles"
            variant="ghost"
            size="lg"
            leftIcon={<Eye size={20} />}
            onClick={() => navigate(`/swaps/${entry.swap_id}`)}
          />
        )}
      </div>
    </div>
  );
}
