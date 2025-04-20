import { useCallback } from 'react';

export function useSwapFeedback() {
  const showSwapFeedback = useCallback((swap) => {
    if (!swap) return;

    switch (swap.status) {
      case 'accepted':
        alert('✅ ¡Intercambio realizado directamente!');
        break;
      case 'proposed':
        alert('✅ Solicitud de intercambio creada. Pendiente de aceptación.');
        break;
      default:
        alert('ℹ️ Estado desconocido del intercambio.');
    }
    
  }, []);

  return {
    showSwapFeedback
  };
}
