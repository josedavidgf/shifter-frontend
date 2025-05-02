import React, { useState } from 'react';
import InputLabel from '../InputField/InputLabel';
import HelperText from '../HelperText/HelperText';
import { CaretDown } from '../../../theme/icons';


const SelectorInput = ({
    name,
    label,
    value = '',
    onChange,
    options = [],
    required = false,
    error = false,
    disabled = false,
    helperText = '',
    errorText = '',
    showCharacterCount = false,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const filled = typeof value === 'string' && value.trim().length > 0;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className={`input-field ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
          <InputLabel
            label={label}
            focused={isFocused}
            filled={filled}
            error={error}
          />
      
          <div className="input-selector__wrapper">
            <select
              id={name}
              name={name}
              className="input-selector__select"
              value={value}
              onChange={onChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
            >
              <option value="" disabled hidden>
                Selecciona una opción
              </option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
      
            <CaretDown className="input-selector__caret" size={20} />
          </div>
      
          <HelperText
            helperText={helperText}
            errorText={errorText}
            showCounter={showCharacterCount}
            valueLength={value.length}
            maxLength={undefined}
            focused={isFocused}
          />
        </div>
      );
      
};

export default SelectorInput;
