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
                    setMessages((prev) => {
                        const alreadyExists = prev.some((msg) =>
                            msg.content === payload.new.content &&
                            msg.sender_id === payload.new.sender_id &&
                            Math.abs(new Date(msg.created_at) - new Date(payload.new.created_at)) < 2000
                        );
                        return alreadyExists ? prev : [...prev, payload.new];
                    });
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

        const tempId = `temp-${Date.now()}`; // identificador temporal
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
            // si falla, cambia el estado del mensaje temporal
            setMessages((prev) =>
                prev.map((m) => m.id === tempId ? { ...m, status: 'failed' } : m)
            );
        }
    };



    return (
        <div>
            <h4>💬 Chat del Intercambio</h4>
            <div style={{ border: '1px solid #ccc', padding: '1rem', maxHeight: '250px', overflowY: 'scroll' }}>
                {messages.map((msg) => (
                    <div key={msg.id} style={{ textAlign: msg.sender_id === myWorkerId ? 'right' : 'left' }}>
                        <div style={{ background: '#eee', display: 'inline-block', padding: '0.5rem', borderRadius: '10px' }}>
                            {msg.content}
                            {msg.status === 'sending' && <span style={{ fontSize: '0.8em', marginLeft: '0.5rem' }}>⏳</span>}
                            {msg.status === 'failed' && <span style={{ fontSize: '0.8em', marginLeft: '0.5rem', color: 'red' }}>❌</span>}
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
