import React, { useState } from 'react';
import InputLabel from './InputLabel';
import InputIcon from './InputIcon';
import HelperText from './HelperText';

const InputField = ({
  name,
  label,
  type = 'text',
  value = '',
  onChange,
  onClear,
  required = false,
  error = false,
  disabled = false,
  placeholder = '',
  helperText = '',
  errorText = '',
  showCharacterCount = false,
  maxLength,
  leftIcon,
  isClearable = false,
  clearableIcon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const filled = typeof value === 'string' && value.trim().length > 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleClear = () => {
    if (onClear) onClear();
  };

  return (
    <div className={`input-field ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
      <div className="input-field__wrapper">
        {leftIcon && <InputIcon icon={leftIcon} />}

        <div className="input-field__container">
          <InputLabel label={label} focused={isFocused} filled={filled} error={error} />

          {type === 'textarea' ? (
            <textarea
              id={name}
              name={name}
              className="input-field__textarea"
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
            />
          ) : (
            <input
              id={name}
              name={name}
              className="input-field__input"
              type={type}
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
            />
          )}

          {isClearable && filled && (
            <InputIcon
              isClearable
              onClick={handleClear}
              clearableIcon={clearableIcon}
            />
          )}
        </div>
      </div>

      <HelperText
        helperText={helperText}
        errorText={errorText}
        showCounter={showCharacterCount}
        valueLength={value.length}
        maxLength={maxLength}
        focused={isFocused}
      />
    </div>
  );
};

export default InputField;
