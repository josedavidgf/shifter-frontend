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
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  const time = format(date, 'HH:mm'); // Formato 24h

  if (isToday(date)) {
    return `Hoy, ${format(date, 'dd/MM')} a las ${time}`;
  }

  if (isTomorrow(date)) {
    return `Mañana, ${format(date, 'dd/MM')} a las ${time}`;
  }

  const full = format(date, "EEEE, dd/MM 'a las' HH:mm", { locale: es });
  return full.charAt(0).toUpperCase() + full.slice(1);
}