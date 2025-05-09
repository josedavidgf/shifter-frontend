import { parseISO, format, isToday, isTomorrow } from 'date-fns';

import es from 'date-fns/locale/es';

export function formatFriendlyDate(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  if (isToday(date)) return `Hoy, ${format(date, 'dd/MM')}`;
  if (isTomorrow(date)) return `Mañana, ${format(date, 'dd/MM')}`;

  const full = format(date, 'EEEE, dd/MM', { locale: es });
  return full.charAt(0).toUpperCase() + full.slice(1);
}

export function formatFriendlyDateTime(dateStr) {
  if (!dateStr) return '';

  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;

  const time = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(date);

  const dateFormatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/Madrid',
  }).format(date);
  const capitalizedWeekDay = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);


  return `${capitalizedWeekDay} a las ${time}`;
}


export function getFriendlyDateParts(dateStr) {
  if (!dateStr) return { label: '', short: '' };
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  if (isToday(date)) return { label: 'Hoy', short: format(date, 'dd/MM') };
  if (isTomorrow(date)) return { label: 'Mañana', short: format(date, 'dd/MM') };

  const weekday = format(date, 'EEEE', { locale: es });
  const short = format(date, 'dd/MM');
  return { label: weekday.charAt(0).toUpperCase() + weekday.slice(1), short };
}
