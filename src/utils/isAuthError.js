// utils/isAuthError.js
export const isAuthError = (error) => {
    // Evita errores de tipo
    if (!error || typeof error !== 'object') return false;
  
    // Puedes ajustar este check según lo que veas en consola
    return (
      error?.status === 400 ||
      error?.message?.toLowerCase().includes('auth') ||
      error?.message?.toLowerCase().includes('login') ||
      error?.message?.toLowerCase().includes('credentials') ||
      error?.message?.toLowerCase().includes('token')
    );
  };
  