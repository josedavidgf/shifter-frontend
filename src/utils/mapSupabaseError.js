import { isAuthError } from './isAuthError';

export const mapSupabaseError = (error) => {
  if (!error) return 'Ocurrió un error desconocido';

  const errorMessage = error.message || error.error_description || 'Error desconocido';

  // Autenticación
  if (isAuthError(error)) {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Email o contraseña incorrectos';
    }

    if (errorMessage.includes('Email not confirmed')) {
      return 'Email no confirmado. Por favor, verifica tu correo electrónico';
    }

    if (errorMessage.includes('User already registered')) {
      return 'Este email ya está registrado';
    }

    if (errorMessage.includes('Password should be at least')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (errorMessage.includes('rate limited')) {
      return 'Demasiados intentos fallidos. Por favor, inténtalo más tarde';
    }

    if (errorMessage.includes('Email link is invalid or has expired')) {
      return 'El enlace de verificación es inválido o ha expirado';
    }
  }

  // Red
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Error de conexión. Por favor, verifica tu conexión a internet';
  }

  // Genérico
  return `Ocurrió un error: ${errorMessage}`;
};
