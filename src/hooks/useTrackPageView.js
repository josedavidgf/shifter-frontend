// src/hooks/useTrackPageView.js
import { useEffect, useRef } from 'react';
import AmplitudeService from '../lib/amplitude';

/**
 * Hook para trackear la vista de una página
 * @param {string} pageName - Nombre de la página para Amplitude (ej: 'calendar')
 */
export default function useTrackPageView(pageName) {
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current) {
      AmplitudeService.track(`${pageName}-viewed`);
      hasTrackedView.current = true;
    }
  }, [pageName]);
}

export function trackEvent(eventName, eventProperties = {}) {
  AmplitudeService.track(eventName, eventProperties);
}