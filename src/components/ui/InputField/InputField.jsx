import React, { useState } from 'react';
import InputLabel from './InputLabel';
import HelperText from './HelperText';
import InputIcon from './InputIcon';

const InputField = ({
  name,
  label,
  placeholder,
  value,
  icon,
  helperText,
  showCharacterCount = false,
  maxLength,
  onFocus,
  onBlur,
  onChange,
  disabled = false,
  multiline = false,
  rows = 1,
  showDeleteButton = false,
  onDeleteButtonPress,
  errorText,
  type = 'text',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const filled = typeof value === 'string' && value.trim().length > 0;
  //const showIcon = icon || (showDeleteButton && filled);
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handleDelete = () => {
    onDeleteButtonPress?.();
  };

  return (
    <div className=
        {`input-field ${disabled ? 'disabled' : ''} 
        ${errorText ? 'error' : ''}`}>
      <InputLabel 
        label={label} 
        focused={isFocused} 
        filled={filled} 
        error={!!errorText} />

      <div className="input-field__wrapper">
        {multiline ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            value={value || ''}
            placeholder={placeholder || label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            maxLength={maxLength}
            disabled={disabled}
            className="input-field__input"
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value || ''}
            placeholder={placeholder || label}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={onChange}
            maxLength={maxLength}
            disabled={disabled}
            className="input-field__input"
          />
        )}

        <InputIcon showDelete={showDeleteButton && filled} onClick={handleDelete} icon={icon} />
      </div>

      <HelperText
        helperText={helperText}
        errorText={errorText}
        showCounter={showCharacterCount}
        valueLength={value?.length}
        maxLength={maxLength}
        focused={isFocused}
      />
    </div>
  );
};

export default InputField;
