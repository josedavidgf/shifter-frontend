import * as Sentry from '@sentry/react';

const isProd = process.env.REACT_APP_ENV === 'production';



let cachedWorkerId = null;

export function setSentryTagsFromWorker(workerProfile) {
  if (!workerProfile || !workerProfile.worker_id) return;

  cachedWorkerId = workerProfile.worker_id; // ✅ lo guardamos en memoria

  Sentry.setUser({ id: workerProfile.worker_id });

  Sentry.setTag("worker_id", workerProfile.worker_id);
  Sentry.setTag("hospital_name", workerProfile.workers_hospitals?.[0]?.hospitals?.name || 'unknown');
  Sentry.setTag("worker_type_name", workerProfile.worker_types?.worker_type_name || 'unknown');
  Sentry.setTag("speciality_category", workerProfile.workers_specialities?.[0]?.specialities?.speciality_category || 'unknown');
}

export function clearSentryContext() {
  cachedWorkerId = null;

  Sentry.setUser(null);
  Sentry.setTag("worker_id", null);
  Sentry.setTag("hospital_name", null);
  Sentry.setTag("worker_type_name", null);
  Sentry.setTag("speciality_category", null);
}


export function reportError(error, extraContext = {}) {
  if (!isProd) {
    console.warn('[Sentry] Error capturado solo en consola:', error, extraContext);
    return;
  }

  const combinedExtra = {
    worker_id: cachedWorkerId || 'unknown',
    ...extraContext,
  };

  Sentry.captureException(error, { extra: combinedExtra });
}


// export function reportMessage(message, extraContext = {}) {
//   if (!isProd) {
//     console.info('[Sentry] Mensaje capturado solo en consola:', message, extraContext);
//     return;
//   }

//   const combinedExtra = {
//     worker_id: cachedWorkerId || 'unknown',
//     ...extraContext,
//   };

//   Sentry.captureMessage(message, {
//     level: 'info', // también puedes usar: 'warning', 'debug', 'error'
//     extra: combinedExtra,
//   });
// }


// // Ejemplo de uso:
// reportMessage('Sincronización omitida: el worker ya tenía datos actualizados', {
//   tipo: 'sync:calendar',
//   motivo: 'caché válida',
// });
