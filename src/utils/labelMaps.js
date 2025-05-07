import { Sun, SunHorizon, Moon, ShieldCheck } from '../theme/icons';


// This file contains the mapping of status labels for different entities in the application.  
export const swapStatusLabels = {
  proposed: 'Pendiente',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  cancelled: 'Anulado',
};
export const swapStatusOptions = Object.entries(swapStatusLabels).map(([value, label]) => ({
  value,
  label,
}));


export const swapStatusTags = {
  proposed: 'Pendiente de aceptar',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  cancelled: 'Anulado',
};

export const shiftStatusLabels = {
  published: 'Publicado',
  swapped: 'Intercambiado',
  received: 'Recibido',
};

export const shiftTypeLabels = {
  morning: 'Mañana',
  evening: 'Tarde',
  night: 'Noche',
  reinforcement: 'Refuerzo',
};

export const shiftTypeIcons = {
  morning: Sun,
  evening: SunHorizon,
  night: Moon,
  reinforcement: ShieldCheck,
};

export const shiftTypeOptions = Object.entries(shiftTypeLabels).map(([value, label]) => ({
  value,
  label,
  icon: shiftTypeIcons[value],
}));
