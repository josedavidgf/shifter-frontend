import React from 'react';

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="toggle-row">
      <span className="toggle-label">{label}</span>
      <div className="switch">
        <input
          type="checkbox"
          className="toggle-input"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider round"></span>
      </div>
    </label>
  );
};

export default ToggleSwitch;
