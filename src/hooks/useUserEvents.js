import { useEffect, useState } from 'react';
import { useUserEventsApi } from '../api/useUserEventsApi';
import { useAuth } from '../context/AuthContext';

export function useUserEvents() {
  const { getToken } = useAuth();
  const { getUserEvents, markUserEventsAsSeen, loading, error } = useUserEventsApi();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const token = await getToken();
    const data = await getUserEvents(token);
    console.log('📦 Eventos recibidos:', data);
    if (data) setEvents(data);
  };

  const markAllAsSeen = async () => {
    const token = await getToken();
    await markUserEventsAsSeen(token);
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  

  return {
    events,
    setEvents, // ✅ Añádelo aquí
    isLoading: loading,
    isError: !!error,
    markAllAsSeen,
    refresh: fetchEvents,
  };
}
