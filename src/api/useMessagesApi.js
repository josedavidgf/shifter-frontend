import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const markMessagesAsRead = async (token, swapId) => {
  try {
    await axios.post(
      `${API_URL}/api/messages/mark-as-read`,
      { swap_id: swapId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error('❌ Error al marcar mensajes como leídos:', err.message);
  }
};

export const getUnreadMessagesPerChat = async (token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/unread`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || 'Error al obtener mensajes no leídos');
    return json.data;
  } catch (err) {
    console.error(err.message);
    return [];
  }
};