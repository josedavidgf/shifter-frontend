import React from 'react';

const HelperText = ({
  helperText,
  errorText,
  showCounter,
  valueLength = 0,
  maxLength,
  focused = false
}) => {
  const shouldShowHelper = focused || errorText;

  if (!shouldShowHelper && !showCounter) return null;

  return (
    <div className="input-field__helper">
      <div className="input-field__messages">
        {errorText && <p className="input-field__error-text">{errorText}</p>}
        {!errorText && helperText && focused && (
          <p className="input-field__helper-text">{helperText}</p>
        )}
      </div>
      {showCounter && maxLength && (
        <p className="input-field__char-count">{`${valueLength}/${maxLength}`}</p>
      )}
    </div>
  );
};

export default HelperText;
