// src/components/DayDetails/DayDetailMyShift.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía
import { Lightning, PencilSimple, Trash } from '../../theme/icons';
import { shiftTypeLabels } from '../../utils/labelMaps';
import { format, parseISO, isToday } from 'date-fns';
import es from 'date-fns/locale/es';

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function DayDetailMyShift({
  dateStr,
  entry,
  dayLabel,
  isPublished,
  onDeletePublication,
  onRemoveShift,
  onEditShift,
  navigate,
  loadingDeletePublication,
  loadingRemoveShift,
}) {
  const parsedDate = parseISO(dateStr);
  const isAvailable = entry.shift_type === 'available';
  const isTodayDate = isToday(parsedDate);
  const displayDay = isTodayDate ? 'Hoy' : capitalize(format(parsedDate, 'EEEE', { locale: es }));

  const getShiftBackground = (type) => {
    switch (type) {
      case 'morning':
        return 'rgba(255, 249, 219, 0.6)';
      case 'evening':
        return 'rgba(255, 226, 235, 0.6)';
      case 'night':
        return 'rgba(229, 234, 255, 0.6)';
      case 'reinforcement':
        return 'rgba(252, 224, 210, 0.6)';
      case 'available':
        return 'rgba(240, 240, 240, 0.6)';
      default:
        return 'rgba(240, 240, 240, 0.6)';
    }
  };

  if (isAvailable) {
    return (
      <div className={`shift-container shift-${entry.shift_type}`} style={{ borderRadius: '12px', backgroundColor: getShiftBackground(entry.shift_type) }}>
        <div style={{ padding: '16px' }}>
          <h3 className="mb-2">
            {`${displayDay}, ${format(parsedDate, 'dd/MM')} - Día libre (disponible)`}
          </h3>

          <p style={{ marginBottom: '16px' }}>
            {isTodayDate
              ? 'Hoy no tienes turno. Lo tienes marcado como disponible para cambiar.'
              : `El ${dayLabel.toLowerCase()} no tienes turno. Lo tienes marcado como disponible para cambiar.`}
          </p>

          <div className="btn-group">
            <Button
              label="Editar disponibilidad"
              variant="outline"
              size="lg"
              onClick={() => onEditShift(dateStr)}
            />
            <Button
              label="Eliminar disponibilidad"
              variant="outline"
              color="danger"
              size="lg"
              onClick={() => onRemoveShift(dateStr)}
              isLoading={loadingRemoveShift}
              disabled={loadingRemoveShift}
            />
          </div>
        </div>
      </div>
    );
  }

  const shiftTitle = `${displayDay}, ${format(parsedDate, 'dd/MM')} - Turno propio`;

  return (
    <div className={`shift-container shift-${entry.shift_type}`} style={{ borderRadius: '12px', backgroundColor: getShiftBackground(entry.shift_type) }}>
      <div style={{ padding: '16px' }}>
        <h3 className="mb-2">{shiftTitle}</h3>

        {isPublished ? (
          <>
            <p style={{ marginBottom: '16px' }}>
              El {dayLabel.toLowerCase()} tienes turno propio de {shiftTypeLabels[entry.shift_type]}
              {entry.shift_type === 'morning' && ' de 8:00 a 15:00'}
              {entry.shift_type === 'evening' && ' de 15:00 a 22:00'}
              {entry.shift_type === 'night' && ' de 22:00 a 08:00'}.{' '}
              <span style={{ fontWeight: 600 }}>Tienes publicado el turno para cambiar.</span>
            </p>
            <Button
              label="Quitar publicación"
              variant="outline"
              leftIcon={<Trash size={20} />}
              size="lg"
              onClick={() => onDeletePublication(entry.shift_id, dateStr)}
              isLoading={loadingDeletePublication}
              disabled={loadingDeletePublication}
            />
          </>
        ) : (
          <>
            <p style={{ marginBottom: '16px' }}>
              El {dayLabel.toLowerCase()} tienes turno propio de {shiftTypeLabels[entry.shift_type]}
              {entry.shift_type === 'morning' && ' de 8:00 a 15:00'}
              {entry.shift_type === 'evening' && ' de 15:00 a 22:00'}
              {entry.shift_type === 'night' && ' de 22:00 a 08:00'}
            </p>
            <div className="btn-group">
              <Button
                label="Publicar turno"
                variant="primary"
                size="lg"
                leftIcon={<Lightning size={20} />}
                onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
              />
              <div className="btn-group-row">
                <Button
                  label="Editar"
                  variant="outline"
                  size="md"
                  leftIcon={<PencilSimple size={20} />}
                  onClick={() => onEditShift(dateStr)}
                />
                <Button
                  label="Eliminar"
                  variant="outline"
                  size="md"
                  leftIcon={<Trash size={20} />}
                  onClick={() => onRemoveShift(dateStr)}
                  isLoading={loadingRemoveShift}
                  disabled={loadingRemoveShift}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}