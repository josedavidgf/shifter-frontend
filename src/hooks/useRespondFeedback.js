import { useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useRespondFeedback() {
  const showRespondFeedback = useCallback((decision) => {
    const messages = {
      accepted: 'Intercambio aceptado',
      rejected: 'Intercambio rechazado',
      unknown: 'Estado desconocido del intercambio',
    };

    const message = messages[decision] || messages['unknown'];

    if (decision === 'accepted') {
      toast.success(message, { duration: 2500, icon: '✅', className: 'toast-success' });
    } else if (decision === 'rejected') {
      toast.success(message, { duration: 2500, icon: '❌', className: 'toast-success' });
    } else {
      toast(message, { duration: 2500, icon: 'ℹ️', className: 'toast-info' });
    }
  }, []);

  return showRespondFeedback;
}
