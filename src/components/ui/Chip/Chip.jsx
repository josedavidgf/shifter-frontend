import React from 'react';

const Chip = ({
  label,
  icon: Icon = null,
  onClick,
  onRemove,
  selected = false,
  disabled = false,
}) => {
  const classNames = [
    'chip',
    selected ? 'chip--selected' : '',
    disabled ? 'chip--disabled' : '',
    onClick ? 'chip--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={!disabled ? onClick : undefined}>
      {Icon && (
        <span className="chip__icon">
          <Icon size={16} weight="bold" />
        </span>
      )}
      <span className="chip__label">{label}</span>
      {onRemove && !disabled && (
        <button className="chip__remove" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
          ×
        </button>
      )}
    </div>
  );
};

export default Chip;
