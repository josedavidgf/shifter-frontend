import { toast } from 'react-hot-toast';

export function useToast() {
  const showSuccess = (message) => {
    toast.success(message, { duration: 2500, icon: '✅', className: 'toast-success' });
  };

  const showError = (message) => {
    toast.error(message, { duration: 3500, icon: '❌', className: 'toast-error' });
  };

  const showInfo = (message) => {
    toast(message, { duration: 2500, icon: 'ℹ️', className: 'toast-info' });
  };

  return {
    showSuccess,
    showError,
    showInfo,
  };
}
