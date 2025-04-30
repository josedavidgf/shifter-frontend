// src/hooks/useTrackPageView.js
import { useEffect, useRef } from 'react';
import { logEvent } from '../lib/amplitude';

/**
 * Hook para trackear la vista de una página
 * @param {string} pageName - Nombre de la página para Amplitude (ej: 'calendar')
 */
export default function useTrackPageView(pageName) {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current) {
      logEvent(`${pageName}-viewed`);
      hasTrackedView.current = true;
    }
  }, [pageName]);
}
