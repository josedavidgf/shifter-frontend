import React, { useState, useEffect } from 'react';
import { MagnifyingGlassPlus } from '../../../theme/icons'; // icono por defecto si no pasamos otro
import HelperText from '../HelperText/HelperText';


function SearchSelectInput({
  options,
  onSelect,
  placeholder = 'Busca...',
  noResultsText = 'No se encontraron resultados',
  helperText = '',
  errorText = '',
  showCharacterCount = false,
  maxLength
}) {
  const [query, setQuery] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFocused, setIsFocused] = useState(false);


  useEffect(() => {
    if (query.length >= 3) {
      const filteredList = options.filter(option =>
        option.label.toLowerCase().includes(query.toLowerCase())
      );
      setFiltered(filteredList);
    } else {
      setFiltered([]);
    }
  }, [query, options]);

  const handleSelect = (option) => {
    setSelected(option);
    setQuery(option.label);
    setFiltered([]);
    onSelect(option);
  };

  return (
    <div className="search-select-input">
      <div className="search-select-input__wrapper">
        <input
          type="text"
          className="search-select-input__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <MagnifyingGlassPlus className="search-select-input__icon" size={20} />
      </div>
      <HelperText
        className="search-select-input__helper"
        helperText={helperText}
        errorText={errorText}
        showCounter={showCharacterCount}
        valueLength={query.length}
        maxLength={maxLength}
        focused={isFocused}
      />

      {query.length >= 3 && (
        <ul className="search-select-input__list">
          {filtered.length > 0 ? (
            filtered.map((option) => (
              <li key={option.value} className="search-select-input__item" onClick={() => handleSelect(option)}>
                {option.label}
              </li>
            ))
          ) : (
            <li className="search-select-input__no-results">
              {noResultsText}
            </li>
          )}
        </ul>
      )}

    </div>
  );
}

export default SearchSelectInput;
