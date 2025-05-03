import React, { useState } from 'react';
import InputLabel from './InputLabel';
import InputIcon from './InputIcon';
import HelperText from '../HelperText/HelperText';
import { Eye, EyeSlash } from '../../../theme/icons';

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
  rightIcon = null,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const filled = typeof value === 'string' && value.trim().length > 0;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleClear = () => {
    if (onClear) onClear();
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

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
            <div className="input-field__input-wrapper">
              <input
                id={name}
                name={name}
                className="input-field__input"
                type={inputType}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
              />
              <div className="input-field__right-icon">
                {type === 'password' ? (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                ) : (
                  rightIcon
                )}
              </div>
            </div>
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