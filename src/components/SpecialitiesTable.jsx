import React, { useState } from 'react';
import SearchFilterInput from '../components/ui/SearchFilterInput/SearchFilterInput';
import Button from '../components/ui/Button/Button';


const SpecialitiesTable = ({ specialities, selectedSpeciality, setSelectedSpeciality }) => {
  const [query, setQuery] = useState('');

  const filteredSpecialities = query.length >= 3
    ? specialities.filter((spec) => {
      const fullName = `${spec.speciality_category ?? ''}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    })
    : specialities;

  return (
    <>
      <div className="filters-container" style={{ marginBottom: '1rem' }}>
        <SearchFilterInput
          value={query}
          onChange={setQuery}
          placeholder="Busca tu especialidad..."
        />
        {query && (
          <Button
            label="Limpiar filtros"
            variant="outline"
            size="lg"
            onClick={() => setQuery('')}
          />
        )}
      </div>

      <div className="specialities-scrollable" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredSpecialities.map((spec) => (
          <div
            key={spec.speciality_id}
            className={`card-base ${selectedSpeciality === spec.speciality_id ? 'selected' : ''}`}
            onClick={() => setSelectedSpeciality(spec.speciality_id)}
            style={{
              border: selectedSpeciality === spec.speciality_id ? '2px solid #0070f3' : '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer'
            }}
          >
            {spec.speciality_category}
          </div>
        ))}
      </div>
    </>
  );
};

export default SpecialitiesTable;