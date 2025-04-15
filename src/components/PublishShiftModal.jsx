import React from 'react';

export default function PublishShiftModal({ shift, onClose, onConfirm }) {
  if (!shift) return null;

  return (
    <div className="modal">
      <p>¿Quieres publicar tu turno de {shift.type} del {shift.date}?</p>
      <button onClick={onConfirm}>📤 Publicar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
