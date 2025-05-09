import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export function useSwapNotifications() {
  const { getToken } = useAuth();
  const [hasPendingSwaps, setHasPendingSwaps] = useState(false);

  useEffect(() => {
    const fetchSwaps = async () => {
      const token = await getToken();
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/swaps/received`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const swaps = res.data.data || [];
        const pending = swaps.some((swap) => swap.status === 'proposed');
        setHasPendingSwaps(pending);
      } catch (error) {
        console.error('Error al cargar swaps pendientes:', error.message);
      }
    };

    fetchSwaps();
  }, []);

  return { hasPendingSwaps };
}
