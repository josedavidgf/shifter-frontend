import React from 'react';

const InputIcon = ({ showDelete, onClick, icon }) => {
  if (!showDelete && !icon) return null;

  return (
    <button type="button" className="input-field__icon" onClick={onClick}>
      {showDelete ? '❌' : icon}
    </button>
  );
};

export default InputIcon;
