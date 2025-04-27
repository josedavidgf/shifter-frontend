// src/services/calendarService.js
import supabase from '../config/supabase';
import { getDay } from 'date-fns';

// Obtener turnos del mes para un worker
export async function getShiftsForMonth(workerId) {
  try {
    const { data, error } = await supabase
      .from('monthly_schedules')
      .select('date, shift_type')
      .eq('worker_id', workerId);

    if (error) {
      throw new Error(error.message || 'Error al cargar turnos del mes');
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('❌ Error en getShiftsForMonth:', err.message);
    return [];
  }
}

// Asignar turno para un día concreto
export async function setShiftForDay(workerId, dateStr, shiftType) {
  try {
    const { error } = await supabase
      .from('monthly_schedules')
      .upsert({ worker_id: workerId, date: dateStr, shift_type: shiftType }, { onConflict: ['worker_id', 'date'] });

    if (error) {
      throw new Error(error.message || 'Error al asignar turno');
    }
  } catch (err) {
    console.error('❌ Error en setShiftForDay:', err.message);
    throw err; // Propagamos el error
  }
}

// Eliminar turno para un día concreto
export async function removeShiftForDay(workerId, dateStr) {
  try {
    const { error } = await supabase
      .from('monthly_schedules')
      .delete()
      .eq('worker_id', workerId)
      .eq('date', dateStr);

    if (error) {
      throw new Error(error.message || 'Error al eliminar turno');
    }
  } catch (err) {
    console.error('❌ Error en removeShiftForDay:', err.message);
    throw err;
  }
}

// Publicar un turno directamente en la tabla de shifts
export async function publishShiftFromCalendar(workerId, shiftType, date) {
  try {
    const { data, error } = await supabase
      .from('shifts')
      .insert([
        {
          worker_id: workerId,
          shift_type: shiftType,
          date,
          status: 'published',
          source: 'calendar',
        }
      ]);

    if (error) {
      throw new Error(error.message || 'Error al publicar turno');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en publishShiftFromCalendar:', err.message);
    throw err;
  }
}

// Utilidad para offset del día
export function getDayOffset(date) {
  const day = getDay(date); // 0 (Sun) - 6 (Sat)
  return day === 0 ? 6 : day - 1;
}
