import { useCallback } from 'react';

/**
 * Hook que muestra feedback según la decisión del intercambio
 */

export function useRespondFeedback() {
  const showRespondFeedback = useCallback((decision) => {
    switch (decision) {
      case 'accepted':
        alert('✅ Intercambio aceptado');
        break;
      case 'rejected':
        alert('❌ Intercambio rechazado');
        break;
      default:
        alert('ℹ️ Estado desconocido del intercambio');
        break;
    }
  }, []);

  return showRespondFeedback;
}
