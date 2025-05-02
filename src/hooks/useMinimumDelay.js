import { useEffect, useState } from 'react';

/**
 * Mantiene el estado de carga visible durante un mínimo de milisegundos, incluso si isLoading pasa a false antes.
 * 
 * @param {boolean} isLoading - Estado de carga actual.
 * @param {number} minMs - Tiempo mínimo en ms que el loader debe mantenerse visible (default: 400ms).
 * @returns {boolean} - Devuelve true si se debe mostrar el loader.
 */
export default function useMinimumDelay(isLoading, minMs = 400) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timeout;
    if (isLoading) {
      setShow(true);
    } else {
      timeout = setTimeout(() => setShow(false), minMs);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, minMs]);

  return show;
}
