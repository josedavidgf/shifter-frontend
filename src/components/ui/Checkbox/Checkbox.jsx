import React from 'react';

export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) {
  return (
    <label htmlFor={id} className={`checkbox-wrapper ${disabled ? 'checkbox-wrapper--disabled' : ''}`}>
      <input
        id={id}
        type="checkbox"
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <div className="checkbox-label-group">
        <span className="checkbox-label">{label}</span>
        {description && <span className="checkbox-description">{description}</span>}
      </div>
    </label>
  );
}