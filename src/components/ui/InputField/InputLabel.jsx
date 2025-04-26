import React from 'react';

const InputLabel = ({ label, focused, filled, error }) => {
  if (!label) return null;

  const isVisible = focused;
  const classNames = [
    'input-field__label',
    isVisible ? 'input-field__label--visible' : '',
    focused ? 'input-field__label--focused' : '',
    filled ? 'input-field__label--filled' : '',
    error ? 'input-field__label--error' : '',
  ].join(' ');

  return (
    <label className={classNames}>
      {label}
    </label>
  );
};

export default InputLabel;
