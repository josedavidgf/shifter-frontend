import React from 'react';
import Button from '../../../components/ui/Button/Button';
import logoTanda from '../../../assets/logo-tanda-light.png';


const EmptyState = ({
  title = 'Nada que mostrar',
  description = '',
  ctaLabel = '',
  onCtaClick = null,
}) => {
  return (
    <div className="empty-state-container">
      {/* <img
        src={logoTanda}
        alt="Tanda Logo"
        className="empty-state-logo"
      /> */}

      <h2 className="empty-state-title">{title}</h2>
      {description && <p className="empty-state-description">{description}</p>}
      {ctaLabel && onCtaClick && (
        <Button
          label={ctaLabel}
          variant="primary"
          size="lg"
          onClick={onCtaClick}
        />
      )}
    </div>
  );
};

export default EmptyState;
