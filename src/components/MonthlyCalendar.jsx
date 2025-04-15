import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getMyWorkerProfile, } from '../services/workerService';
import { getShiftsForMonth, setShiftForDay, removeShiftForDay } from '../services/calendarService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const shiftColors = {
  morning: 'bg-blue-400',
  evening: 'bg-green-400',
  night: 'bg-yellow-300',
  '': 'bg-gray-200',
};

const shiftTypes = {
  '': '',
  morning: 'morning',
  evening: 'evening',
  night: 'night',
};

export default function MonthlyCalendar() {
  const [workerId, setWorkerId] = useState('');
  const [monthDays, setMonthDays] = useState([]);
  const [shiftMap, setShiftMap] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const { getToken } = useAuth(); // para auth.uid
  const [setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchCalendar() {
      try {
        const token = await getToken();
        const [year, month] = selectedMonth.split('-');
        const start = startOfMonth(new Date(year, month - 1));
        const end = endOfMonth(start);
        const days = eachDayOfInterval({ start, end });
        const worker = await getMyWorkerProfile(token);
        setMonthDays(days);
        const fetchedWorkerId = worker.worker_id;
        setWorkerId(fetchedWorkerId);
        console.log('ID del trabajador:', fetchedWorkerId);
        if (fetchedWorkerId) {
          getShiftsForMonth(fetchedWorkerId, year, month).then(setShiftMap).catch(console.error);
        }
      } catch (err) {
        setError('No se pudo cargar el intercambio');
        console.error(err.message);
      }
    }
    fetchCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const toggleShift = async (dateStr) => {
    const current = shiftMap[dateStr] || '';
    const next = current === '' ? 'morning' : current === 'morning' ? 'evening' : current === 'evening' ? 'night' : '';
    setShiftMap((prev) => ({ ...prev, [dateStr]: next }));

    try {
      if (next === '') {
        await removeShiftForDay(workerId, dateStr);
      } else {
        await setShiftForDay(workerId, dateStr, next);
      }
    } catch (error) {
      console.error('Error al guardar turno:', error);
    }
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };



  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendario de Turnos</h2>

      <div className="mb-4">
        <label className="font-medium mr-2">Selecciona mes:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="grid grid-cols-7 gap-2">
        {monthDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const shift = shiftMap[dateStr] || '';
          console.log('Shift:', shift);
          const isPast = day > new Date();
          return (
            <div
              key={dateStr}
              className={`h-20 w-20 flex flex flex-col item-center justify-center rounded cursor-pointer ${shiftColors[shift]} ${isPast ? 'opacity-50':''}`}
              onClick={() => toggleShift(dateStr)}
            >
              <div className="text-sm font-medium text-black">
                {format(day, 'd')} {shiftTypes[shift]}
              </div>
              {shift && isPast && (
                <button
                  className='absolute bottom-1 text-xs bg-white border border-gray-400 rounded px-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/shifts/create/?date=${dateStr}&shift_type=${shift}`);
                  }}
                >
                  Publicar
                  </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
