import React, { useEffect, useState, useRef } from 'react';
import supabase from '../config/supabase';
import { getMessagesBySwap, sendMessage } from '../services/messagesService';

const ChatBox = ({ swapId, myWorkerId, otherWorkerId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

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
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [swapId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newMsg = {
      swap_id: swapId,
      sender_id: myWorkerId,
      recipient_id: otherWorkerId,
      content: newMessage,
      created_at: new Date().toISOString(),
    };
  
    // Render inmediato en local
    setMessages((prev) => [...prev, newMsg]);
  
    // Enviar al backend
    await sendMessage(newMsg);
  
    setNewMessage('');
  };
  

  return (
    <div>
      <h4>💬 Chat del Intercambio</h4>
      <div style={{ border: '1px solid #ccc', padding: '1rem', maxHeight: '250px', overflowY: 'scroll' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ textAlign: msg.sender_id === myWorkerId ? 'right' : 'left' }}>
            <div style={{ background: '#eee', display: 'inline-block', padding: '0.5rem', borderRadius: '10px' }}>
              {msg.content}
            </div>
            <br />
            <small>{new Date(msg.created_at).toLocaleString()}</small>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChatBox;
