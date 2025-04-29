import toast, { Toaster } from 'react-hot-toast';

export function useToast() {
  const showToast = (message, type = 'success') => {
    toast(message, {
      duration: 2500,
      icon: type === 'success'
        ? '✅'
        : type === 'error'
        ? '❌'
        : type === 'warning'
        ? '⚠️'
        : 'ℹ️',
      className:
        type === 'success'
          ? 'toast toast--success'
          : type === 'error'
          ? 'toast toast--error'
          : type === 'warning'
          ? 'toast toast--warning'
          : 'toast toast--info',
      position: 'bottom-center',
    });
  };

  return {
    showSuccess: (msg) => showToast(msg, 'success'),
    showError: (msg) => showToast(msg, 'error'),
    showInfo: (msg) => showToast(msg, 'info'),
    showWarning: (msg) => showToast(msg, 'warning'),
  };
}

export const ToastUI = () => <Toaster />;
