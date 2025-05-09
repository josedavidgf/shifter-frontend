// src/hooks/useUnreadMessages.js
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkerApi } from '../api/useWorkerApi';
import { getUnreadMessagesPerChat } from '../services/messagesService';

export function useUnreadMessages() {
  const { getToken } = useAuth();
  const { getMyWorkerProfile } = useWorkerApi();
  const [unreadSwapIds, setUnreadSwapIds] = useState([]);

  const fetchUnread = async () => {
    try {
      const token = await getToken();
      const profile = await getMyWorkerProfile(token);
      const res = await getUnreadMessagesPerChat(profile.worker_id);
      setUnreadSwapIds(res.map((r) => r.swap_id));
    } catch (err) {
      console.error('Error al comprobar mensajes no leídos:', err.message);
    }
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  return {
    unreadSwapIds,
    refreshUnreadMessages: fetchUnread,
    hasUnreadMessages: unreadSwapIds.length > 0,
  };
}
