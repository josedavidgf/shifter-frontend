import React, { useState } from 'react';
import axios from 'axios';

const GptShiftsChat = ({ calendarData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de turnos. Puedes preguntarme cómo reorganizar tus días, cuántas mañanas tienes o cómo optimizar tus descansos.',
    },
  ]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const updatedHistory = [...messages, userMessage];

    try {
      const res = await axios.post('/api/gpt-shifts', {
        message: input,
        history: updatedHistory,
        calendarData,
      });

      const gptReply = {
        role: 'assistant',
        content: res.data.reply,
      };

      setMessages([...updatedHistory, gptReply]);
      setInput('');
    } catch (err) {
      console.error('Error al contactar con GPT:', err);
    }
  };

  return (
    <div className="p-4 border rounded max-w-2xl mx-auto bg-white shadow">
      <h2 className="text-xl font-bold mb-4">🧠 Asistente de Turnos</h2>
      <div className="h-64 overflow-y-auto mb-4 border p-3 bg-gray-50 rounded space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <input
        className="border rounded w-full p-2 mb-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu pregunta..."
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        onClick={handleSend}
      >
        Enviar
      </button>
    </div>
  );
};

export default GptShiftsChat;