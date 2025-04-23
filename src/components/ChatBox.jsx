import React, { useEffect, useState, useRef } from 'react';
import supabase from '../config/supabase';
import { getMessagesBySwap, sendMessage } from '../services/messagesService';
import { formatDate, getVerb, getOtherVerb } from '../utils/dateUtils';

const ChatBox = ({ swapId, myWorkerId, otherWorkerId, otherPersonName, otherPersonSurname, myDate, otherDate }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const [inputDisabled, setInputDisabled] = useState(false);

    console.log('otherDate', otherDate);

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
                        const tempMessageIndex = prev.findIndex((msg) =>
                            msg.status === 'sending' &&
                            msg.content === payload.new.content &&
                            msg.sender_id === payload.new.sender_id
                        );

                        if (tempMessageIndex !== -1) {
                            // Encontramos un mensaje temporal que coincide → reemplazarlo
                            const updated = [...prev];
                            updated[tempMessageIndex] = payload.new;
                            return updated;
                        } else {
                            // No encontramos, añadir nuevo
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
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const hasSending = messages.some((msg) => msg.status === 'sending');
        setInputDisabled(hasSending);
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
        <div className="chatbox-container">
            <div className="chatbox-header">
                <p><strong>💬 Estás chateando con {otherPersonName} {otherPersonSurname}</strong></p>
                <p>📅 {getVerb(myDate)} {formatDate(myDate)}</p>
                <p>📅 {otherPersonName} {getOtherVerb(otherDate)} {formatDate(otherDate)}</p>
            </div>

            <div className="chatbox-messages">
                {[...messages]
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .map((msg, index) => (
                        <div key={`${msg.id}-${index}`} style={{ textAlign: msg.sender_id === myWorkerId ? 'right' : 'left' }}>
                            <div
                                className={`message-bubble ${msg.sender_id === myWorkerId ? 'message-bubble-own' : 'message-bubble-other'}`}
                                style={{
                                    transform: msg.status === 'sending' ? 'scale(0.95)' : 'scale(1)',
                                    opacity: msg.status === 'sending' ? 0.6 : 1,
                                }}
                            >
                                {msg.content}
                                {msg.status === 'sending' && <span>⏳</span>}
                                {msg.status === 'failed' && <span style={{ color: 'red' }}>❌</span>}
                            </div>
                            <br />
                            <small>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                        </div>
                    ))}
                <div ref={bottomRef} />
            </div>

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
                <button type="submit" disabled={inputDisabled} className="chatbox-button">Enviar</button>
            </form>
        </div>

    );
};

export default ChatBox;
