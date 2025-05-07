import React, { useEffect, useState, useRef } from 'react';
import supabase from '../config/supabase';
import { getMessagesBySwap, sendMessage } from '../services/messagesService';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button/Button';
import { PaperPlaneTilt } from '../theme/icons';


const ChatBox = ({
  swapId,
  myWorkerId,
  otherWorkerId,
  otherPersonName,
  otherPersonSurname,
  myDate,
  otherDate
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputDisabled, setInputDisabled] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    getMessagesBySwap(swapId).then(setMessages);

    const channel = supabase
      .channel(`messages-swap-${swapId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `swap_id=eq.${swapId}`,
        },
        (payload) => {
          setMessages((prev) => {
            const tempMessageIndex = prev.findIndex(
              (msg) =>
                msg.status === 'sending' &&
                msg.content === payload.new.content &&
                msg.sender_id === payload.new.sender_id
            );

            if (tempMessageIndex !== -1) {
              const updated = [...prev];
              updated[tempMessageIndex] = payload.new;
              return updated;
            } else {
              return [...prev, payload.new];
            }
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [swapId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);


  useEffect(() => {
    const hasSending = messages.some((msg) => msg.status === 'sending');
    setInputDisabled(hasSending);
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      swap_id: swapId,
      sender_id: myWorkerId,
      recipient_id: otherWorkerId,
      content: newMessage,
      created_at: new Date().toISOString(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    try {
      await sendMessage({
        swap_id: swapId,
        sender_id: myWorkerId,
        recipient_id: otherWorkerId,
        content: newMessage,
      });
    } catch (err) {
      console.error('❌ Error enviando mensaje:', err.message);
      showError('No se pudo enviar el mensaje. Inténtalo de nuevo.');

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m))
      );
    }
  };

  return (
    <div className="chatbox">
      <div className="chatbox-messages-wrapper" ref={messagesContainerRef}>
        {[...messages]
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
          .map((msg, index) => (
            <div
              key={`${msg.id}-${index}`}
              style={{
                textAlign: msg.sender_id === myWorkerId ? 'right' : 'left',
              }}
            >
              <div
                className={`message-bubble ${msg.sender_id === myWorkerId
                  ? 'message-bubble-own'
                  : 'message-bubble-other'
                  }`}
                style={{
                  transform: msg.status === 'sending' ? 'scale(0.95)' : 'scale(1)',
                  opacity: msg.status === 'sending' ? 0.6 : 1,
                }}
              >
                {msg.content}
                {msg.status === 'sending' && <span>⏳</span>}
                {msg.status === 'failed' && (
                  <span style={{ color: 'red' }}>❌</span>
                )}
              </div>
              <br />
              <small>
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </small>
            </div>
          ))}
      </div>

      <div className="chatbox-input-area">
        <form onSubmit={handleSubmit} className="chatbox-form">
          <input
            type="text"
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            required
            disabled={inputDisabled}
            className="chatbox-input"
          />
          <Button
            type="submit"
            disabled={inputDisabled}
            leftIcon={<PaperPlaneTilt size={20} />}
            size="sm"
          />
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
