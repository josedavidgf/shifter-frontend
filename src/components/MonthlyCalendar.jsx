import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getMyWorkerProfile, } from '../services/workerService';
import { getShiftsForMonth, setShiftForDay, removeShiftForDay, getDayOffset } from '../services/calendarService';
import { getAcceptedSwaps } from '../services/swapService';
import { getMyShifts } from '../services/shiftService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../index.css';


function getShiftLabel(shift) {
  switch (shift) {
    case 'morning':
      return 'M';
    case 'evening':
      return 'T';
    case 'night':
      return 'N';
    default:
      return '';
  }
}

export default function MonthlyCalendar() {
  const [workerId, setWorkerId] = useState('');
  const [monthDays, setMonthDays] = useState([]);
  const [shiftMap, setShiftMap] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));
  const { getToken } = useAuth(); // para auth.uid
  //const [setError] = useState(null);
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

        // opción anterior
        /* if (fetchedWorkerId) {
          getShiftsForMonth(fetchedWorkerId, year, month).then(setShiftMap).catch(console.error);
        } */
        if (!fetchedWorkerId) return;

        // Opción última propuesta
        const shifts = await getShiftsForMonth(fetchedWorkerId, year, month);
        const publishedShifts = await getMyShifts(token);
        console.log('Turnos publicados:', publishedShifts);
        const swaps = await getAcceptedSwaps(token);
        console.log('Turnos:', shifts);
        console.log('Swaps:', swaps);

        // Creamos el shiftMap enriquecido
        const enrichedMap = {};

        (shifts || []).forEach(({ date, shift_type }) => {
          enrichedMap[date] = enrichedMap[date] || {};
          enrichedMap[date].type = shift_type;
          enrichedMap[date].isMyShift = true
        });

        /* shifts.forEach(({ date, shift_type }) => {
          enrichedMap[date] = { type: shift_type };
        }); */

        (publishedShifts || []).forEach(({ date }) => {
          if (enrichedMap[date]) enrichedMap[date].isPublished = true;
        });

        (swaps || []).forEach(({ offered_date, offered_type }) => {
          enrichedMap[offered_date] = enrichedMap[offered_date] || {};
          enrichedMap[offered_date].type = offered_type;
          enrichedMap[offered_date].isReceived = true;
        });

        swaps.forEach(({ shift }) => {
          if (shift && shift.date && enrichedMap[shift.date]) {
            enrichedMap[shift.date].isSwapped = true;
          }
        });

        console.log('EnrichedMap:', enrichedMap);

        setShiftMap(enrichedMap);
        console.log('Shif map:', shiftMap);


      } catch (err) {
        console.error('Error al cargar calendario:', err.message);
      }
    }
    fetchCalendar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  const toggleShift = async (dateStr) => {
    const current = shiftMap[dateStr]?.type || '';
    const next =
      current === ''
        ? 'morning'
        : current === 'morning'
          ? 'evening'
          : current === 'evening'
            ? 'night'
            : '';

    try {
      if (next === '') {
        await removeShiftForDay(workerId, dateStr);
        setShiftMap((prev) => {
          const updated = { ...prev };
          delete updated[dateStr];
          return updated;
        });
      } else {
        await setShiftForDay(workerId, dateStr, next);
        setShiftMap((prev) => ({
          ...prev,
          [dateStr]: {
            type: next,
            isMyShift: true, // 👈 necesario para que salga botón de publicar
          },
        }));
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

      <div className="calendar-container">
        <div className="calendar-grid">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dayName) => (
            <div key={dayName} className="calendar-header">{dayName}</div>
          ))}

          {Array.from({ length: getDayOffset(monthDays[0]) }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty" />
          ))}

          {monthDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const shiftData = shiftMap[dateStr] || {};
            const shift = shiftData.type || '';
            const flags = shiftData || {};
            const isPast = day < new Date();

            const indicator = flags.isReceived
              ? '✅ Turno recibido'
              : flags.isSwapped
                ? '🔁 Turno traspasado'
                : flags.isPublished
                  ? '📢 Turno publicado'
                  : flags.isMyShift
                    ? '✔️'
                    : '';

            return (
              <div
                key={dateStr}
                className={`calendar-day shift-${shift} ${isPast ? 'past' : ''}`}
                onClick={() => {
                  if (!isPast) toggleShift(dateStr);
                }}
              >
                <div className="calendar-text">
                  {format(day, 'd')} {getShiftLabel(shift)} {indicator}
                </div>

                {flags.isMyShift && !flags.isPublished && !isPast && (
                  <button
                    className="publish-button"
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
    </div>
  );
}
