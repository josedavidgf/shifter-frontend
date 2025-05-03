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

  if (isAvailable) {
    return (
      <div>
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
    );
  }

  const shiftTitle = `${displayDay}, ${format(parsedDate, 'dd/MM')} - Turno propio`;

  return (
    <div>
      <h3 className="mb-2">{shiftTitle}</h3>

      {isPublished ? (
        <>
          <p style={{ marginBottom: '16px' }}>
            El {dayLabel.toLowerCase()} tienes turno propio de {shiftTypeLabels[entry.shift_type]}.{' '}
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
            El {dayLabel.toLowerCase()} tienes turno propio de {shiftTypeLabels[entry.shift_type]}.
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
  );
}