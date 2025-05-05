import { useCallback } from 'react';
import { useToast } from './useToast';

export function useSwapFeedback() {
  const { showInfo, showSuccess } = useToast();

  const showSwapFeedback = useCallback((swap) => {
    if (!swap) return;

    switch (swap.status) {
      case 'accepted':
        showSuccess('¡Intercambio realizado directamente!');
        break;
      case 'proposed':
        showSuccess('Solicitud de intercambio creada. Pendiente de aceptación.');
        break;
      default:
        showInfo('ℹEstado desconocido del intercambio.');
    }
    
  }, []);

  return {
    showSwapFeedback
  };
}
