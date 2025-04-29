// src/components/DayDetails/DayDetailMyShift.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía
import { Lightning, PencilSimple, Trash } from '../../theme/icons';


export default function DayDetailMyShift({
  dateStr,
  entry,
  dayLabel,
  onDeletePublication,
  onRemoveShift,
  onEditShift,
  navigate,
}) {
  return (
    <div>
      <h3 className="mb-2">{dayLabel} - Tu turno</h3>
      <p>Tipo: {entry.shift_type}</p>

      {entry.isPublished ? (
        <>
          <p>Turno publicado</p>
          <Button
            label="Quitar publicación"
            variant="outline"
            leftIcon={<Trash size={20} />}
            size="lg"
            onClick={() => onDeletePublication(entry.shift_id, dateStr)} // ✅ pasamos dateStr
          />
        </>
      ) : (
        <>
          <div className="btn-group">
            <Button
              label="Publicar turno"
              variant="primary"
              size="lg"
              leftIcon={<Lightning size={20} />}
              rightIcon={<Lightning size={20} />}
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
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
