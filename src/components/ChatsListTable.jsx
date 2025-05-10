import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchFilterInput from '../components/ui/SearchFilterInput/SearchFilterInput';
import Button from '../components/ui/Button/Button';
import EmptyState from '../components/ui/EmptyState/EmptyState';
import { Sparkle } from '../theme/icons';
import ChatCardContent from '../components/ui/Cards/ChatCardContent';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useUnreadMessages } from '../hooks/useUnreadMessages';



const ChatsListTable = ({ swaps, workerId }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { isEnabled } = useFeatureFlags();
  const { unreadSwapIds } = useUnreadMessages();


  console.log('isEnabled', isEnabled('chat_tanda_ai'));


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
      {isEnabled('chat_tanda_ai') && (
        <div
          className="chat-card"
          style={{
            background: 'linear-gradient(90deg, #FAF5FF 0%, #E9D8FD 100%)',
            border: '1px solid #6B46C1',
            marginBottom: '1rem',
            cursor: 'pointer',
            borderRadius: '12px',
            padding: '16px',
          }}
          onClick={() => navigate('/chat-turnos')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkle size={18} weight="fill" color="#322659" />
            <strong>Tanda, búscame los mejores turnos</strong>
          </div>
          <p>Utiliza Tanda IA y haz preguntas sobre tus turnos, días libres, vacaciones, etc.</p>
        </div>
      )}

      {filteredSwaps.length === 0 ? (
        <EmptyState
          title="Sin resultados"
          description="No hay chats que coincidan con tu búsqueda."
        />
      ) : (
        <div className="card-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSwaps.map((swap) => {
            const hasUnread = unreadSwapIds.includes(swap.swap_id);
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
                className="card-base"
                style={{ position: 'relative' }}
                onClick={() => navigate(`/chats/${swap.swap_id}`)}
              >
                {hasUnread && <span className="card-notification-dot " />}
                <ChatCardContent
                  otherPersonName={otherPersonName}
                  myDate={myDate}
                  myType={myDateType}
                  otherDate={otherDate}
                  otherType={otherType}
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ChatsListTable;
