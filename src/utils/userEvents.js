import { CalendarCheck } from '../theme/icons'; // o los iconos que uséis
import { formatFriendlyDate } from './formatFriendlyDate';
import { translateShiftType } from './translateServices';


export const USER_EVENT_CONFIG = {
  shift_published: {
    icon: <CalendarCheck size={20} />,
    title: 'Turno publicado',
    getDescription: (metadata) =>
      `Has publicado tu turno del ${formatFriendlyDate(metadata.date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  swap_proposed: {
    icon: <CalendarCheck size={20} />,
    title: 'Has propuesto un intercambio',
    getDescription: (metadata) =>
      `Has ofrecido a ${metadata.shift_owner_name} ${metadata.shift_owner_surname} tu turno del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)} por su turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  swap_received: {
    icon: <CalendarCheck size={20} />,
    title: 'Te han propuesto un intercambio',
    getDescription: (metadata) =>
      `${metadata.requester_name} ${metadata.requester_surname} te ha ofrecido su turno del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)}) por tu turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  // Añadir más eventos aquí
};
