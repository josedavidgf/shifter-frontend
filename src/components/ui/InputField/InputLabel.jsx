import React from 'react';

const InputLabel = ({ label, focused, filled, error }) => {
  const isHidden = !focused && !filled;
  if (!label || isHidden) return null;

  let className = 'input-field__label';

  if (error && focused) {
    className += ' input-field__label--error';
  } else if (focused) {
    className += ' input-field__label--focused';
  } else if (filled) {
    className += ' input-field__label--filled';
  }

  return <label className={className}>{label}</label>;
};

export default InputLabel;
