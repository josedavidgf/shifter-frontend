// src/components/DayDetails/DayDetailMyShift.jsx
import React from 'react';
import Button from '../ui/Button/Button'; // Ajusta si tu path varía
import { Lightning } from '../../theme/icons';


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
      <h3 className="font-bold mb-2">{dayLabel} - Tu turno</h3>
      <p>Tipo: {entry.shift_type}</p>

      {entry.isPublished ? (
        <>
          <p>Turno publicado</p>
          <Button
            label="Quitar publicación"
            variant="ghost"
            size="lg"
            onClick={() => onDeletePublication(entry.shift_id, dateStr)} // ✅ pasamos dateStr
          />
        </>
      ) : (
        <>
          <Button
            label="Publicar turno"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} />}
            rightIcon={<Lightning size={20} />}
            onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
          />

          <Button
            label="Eliminar turno"
            variant="outline"
            size="md"
            onClick={() => onRemoveShift(dateStr)}
          />

          <Button
            label="Editar turno"
            variant="outline"
            size="md"
            onClick={() => onEditShift(dateStr)}
          />
        </>
      )}
    </div>
  );
}
