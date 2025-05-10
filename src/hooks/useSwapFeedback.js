// hooks/useSwapFeedback.js
import { useCallback, useState } from 'react';

export function useSwapFeedback() {
  const [modalStatus, setModalStatus] = useState(null);

  const showSwapFeedback = useCallback((swap) => {
    if (!swap) return;

    if (swap.status === 'accepted' || swap.status === 'proposed') {
      setModalStatus(swap.status);
    } else {
      setModalStatus('unknown');
    }
  }, []);

  return {
    showSwapFeedback,
    modalStatus,
    setModalStatus,
  };
}
