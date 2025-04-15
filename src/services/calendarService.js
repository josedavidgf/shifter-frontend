import supabase from '../config/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export async function getShiftsForMonth(workerId, year, month) {
  const start = format(startOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
  const end = format(endOfMonth(new Date(year, month - 1)), 'yyyy-MM-dd');
    console.log('start', start);
    console.log('end', end);
  const { data, error } = await supabase
    .from('monthly_schedules')
    .select('date, shift_type')
    .eq('worker_id', workerId)
    .gte('date', start)
    .lte('date', end);
    console.log('data', data);
  if (error) throw new Error(error.message);

  return data.reduce((acc, { date, shift_type }) => {
    acc[date] = shift_type;
    return acc;
  }, {});
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
  