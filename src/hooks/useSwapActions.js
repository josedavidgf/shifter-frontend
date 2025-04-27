import { useCallback } from 'react';

/**
 * Hook que devuelve las funciones memorizadas para aceptar o rechazar un swap.
 * @param {string} swapId - ID del swap
 * @param {function} respondFn - Función que gestiona la respuesta al swap
 */
export function useSwapActions(swapId, respondFn) {
  const handleAcceptSwap = useCallback(() => {
    respondFn(swapId, 'accepted');
  }, [swapId, respondFn]);

  const handleRejectSwap = useCallback(() => {
    respondFn(swapId, 'rejected');
  }, [swapId, respondFn]);

  return {
    handleAcceptSwap,
    handleRejectSwap,
  };
}
