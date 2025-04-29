import React from 'react';

function SearchFilterInput({ value, onChange, placeholder = 'Busca...' }) {
  return (
    <div className="search-filter-input">
      <input
        type="text"
        className="search-filter-input__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchFilterInput;
