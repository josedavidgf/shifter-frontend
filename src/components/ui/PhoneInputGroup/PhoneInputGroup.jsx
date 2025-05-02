import React from 'react';
import SelectorInput from '../SelectorInput/SelectorInput';
import InputField from '../InputField/InputField';

const PhoneInputGroup = ({
  prefix,
  phone,
  onChange,
  prefixOptions,
  error = false,
  helperText = '',
  errorText = '',
  disabled = false,
}) => {
  const handlePrefixChange = (e) => {
    onChange({ prefix: e.target.value, phone });
  };

  const handlePhoneChange = (e) => {
    onChange({ prefix, phone: e.target.value });
  };

  return (
    <div className={`phone-input-group ${error ? 'error' : ''}`}>
      <div className="phone-input-group__wrapper">
        <div className="phone-input-group__prefix">
          <SelectorInput
            label="Prefijo"
            name="prefix"
            value={prefix}
            onChange={handlePrefixChange}
            options={prefixOptions}
            disabled={disabled}
          />
        </div>
        <div className="phone-input-group__number">
          <InputField
            label="Teléfono"
            name="mobile_phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            disabled={disabled}
            error={error}
            helperText={helperText}
            errorText={errorText}
          />
        </div>
      </div>
    </div>
  );
};

export default PhoneInputGroup;
