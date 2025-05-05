import { CalendarCheck, Repeat,CheckCircle,XCircle,ArrowsClockwise } from '../theme/icons'; // o los iconos que uséis
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
    icon: <Repeat size={20} />,
    title: 'Has propuesto un intercambio',
    getDescription: (metadata) =>
      `Has ofrecido a ${metadata.shift_owner_name} ${metadata.shift_owner_surname} tu turno del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)} por su turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  swap_received: {
    icon: <Repeat size={20} />,
    title: 'Te han propuesto un intercambio',
    getDescription: (metadata) =>
      `${metadata.requester_name} ${metadata.requester_surname} te ha ofrecido su turno del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)}) por tu turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  swap_accepted: {
    icon: <CheckCircle size={20} />,
    title: 'Tu intercambio ha sido aceptado',
    getDescription: (metadata) =>
      `Tu turno ofrecido del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)}) ha sido aceptado. Recibirás el turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  
  swap_rejected: {
    icon: <XCircle size={20} />,
    title: 'Tu intercambio ha sido rechazado',
    getDescription: (metadata) =>
      `El turno que propusiste para el ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}) ha sido rechazado.`,
  },
  
  swap_accepted_automatically_requester: {
    icon: <ArrowsClockwise size={20} />,
    title: 'Intercambio automático realizado',
    getDescription: (metadata) =>
      `Tu turno ofrecido del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)}) ha sido intercambiado automáticamente por el turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}).`,
  },
  
  swap_accepted_automatically_owner: {
    icon: <ArrowsClockwise size={20} />,
    title: 'Tu turno ha sido intercambiado automáticamente',
    getDescription: (metadata) =>
      `Tu turno del ${formatFriendlyDate(metadata.shift_date)} (${translateShiftType(metadata.shift_type)}) ha sido intercambiado automáticamente por el turno del ${formatFriendlyDate(metadata.offered_date)} (${translateShiftType(metadata.offered_type)}).`,
  },  
  // Añadir más eventos aquí
};
