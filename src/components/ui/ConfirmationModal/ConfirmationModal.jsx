// src/components/ui/Modal/ConfirmationModal.jsx
import React from 'react';
import Button from '../Button/Button';
import { X } from '../../../theme/icons';

const ConfirmationModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container shadow-lg fade-in">
        <button className="modal-close" onClick={onCancel} aria-label="Cerrar modal">
          <X size={20} weight="bold" />
        </button>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-description">{description}</p>
        <div className="modal-buttons">
          <Button label={cancelLabel} variant="outline" onClick={onCancel} />
          <Button label={confirmLabel} variant="primary" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
