import supabase from '../config/supabase';
import { /* format, startOfMonth, endOfMonth, */ getDay} from 'date-fns';

export async function getShiftsForMonth(workerId /*, year, month */) {
/*     const start = format(startOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
    const end = format(endOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd'); */


    const { data, error } = await supabase
        .from('monthly_schedules')
        .select('date, shift_type')
        .eq('worker_id', workerId)
/*         .gte('date', start)
        .lte('date', end); */
    if (error) {
        console.error('❌ Error en getShiftsForMonth:', error.message);
        return []; // Devuelve array vacío para evitar petadas
    }

    return Array.isArray(data) ? data : [];
}

export async function setShiftForDay(workerId, dateStr, shiftType) {
    const { error } = await supabase
        .from('monthly_schedules')
        .upsert({ worker_id: workerId, date: dateStr, shift_type: shiftType }, { onConflict: ['worker_id', 'date'] });

    if (error) throw new Error(error.message);
}

export async function removeShiftForDay(workerId, dateStr) {
    const { error } = await supabase
        .from('monthly_schedules')
        .delete()
        .eq('worker_id', workerId)
        .eq('date', dateStr);

    if (error) throw new Error(error.message);
}

export async function publishShiftFromCalendar(workerId, shiftType, date) {
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

    if (error) throw error;
    return data;
}

export function getDayOffset(date) {
    const day = getDay(date); // 0 (Sun) - 6 (Sat)
    return day === 0 ? 6 : day - 1;
}