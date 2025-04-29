import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getVerb, getOtherVerb } from '../utils/dateUtils';
import SearchFilterInput from '../components/ui/SearchFilterInput/SearchFilterInput';
import Button from '../components/ui/Button/Button';

const ChatsListTable = ({ swaps, workerId }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filteredSwaps = query.length >= 3
    ? swaps.filter((swap) => {
        const iAmRequester = swap.requester_id === workerId;
        const otherPerson = iAmRequester ? swap.shift.worker : swap.requester;
        const otherPersonName = `${otherPerson?.name ?? ''} ${otherPerson?.surname ?? ''}`.toLowerCase();
        return otherPersonName.includes(query.toLowerCase());
      })
    : swaps;

  return (
    <>
      <div className="filters-container" style={{ marginBottom: '1rem' }}>
        <SearchFilterInput
          value={query}
          onChange={setQuery}
          placeholder="Busca por nombre de compañero..."
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

      {/* Chat GPT fijo arriba */}
      <div
        className="chat-card"
        style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          marginBottom: '1rem',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/chat-turnos')}
      >
        <strong>🧠 GPT - Optimiza mis turnos</strong>
        <p>Haz preguntas sobre tus turnos, días libres, vacaciones, etc.</p>
      </div>

      {filteredSwaps.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          No hay chats que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="chat-list">
          {filteredSwaps.map((swap) => {
            const iAmRequester = swap.requester_id === workerId;
            const myDate = iAmRequester ? swap.offered_date : swap.shift.date;
            const myDateType = iAmRequester ? swap.offered_type : swap.shift.shift_type;
            const otherDate = iAmRequester ? swap.shift.date : swap.offered_date;
            const otherType = iAmRequester ? swap.shift.shift_type : swap.offered_type;
            const otherPersonName = iAmRequester
              ? `${swap.shift.worker?.name} ${swap.shift.worker?.surname}`
              : `${swap.requester?.name} ${swap.requester?.surname}`;

            return (
              <div
                key={swap.swap_id}
                className="chat-card"
                onClick={() => navigate(`/chats/${swap.swap_id}`)}
              >
                <strong>Intercambio #{swap.swap_id}</strong>
                <span>
                  {getVerb(myDate)} el {formatDate(myDate)} {myDateType} y {otherPersonName} {getOtherVerb(otherDate)} el {formatDate(otherDate)} {otherType}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChatsListTable;