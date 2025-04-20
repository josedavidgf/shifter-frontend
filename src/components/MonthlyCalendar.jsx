// src/components/MonthlyCalendar.jsx (actualizado)
import { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, /* isSameDay, */ parseISO } from 'date-fns';
import { getShiftsForMonth, setShiftForDay, removeShiftForDay, getDayOffset } from '../services/calendarService';
import { getAcceptedSwaps } from '../services/swapService';
import { getMyShifts } from '../services/shiftService';
import { getMySwapPreferences, createSwapPreference, deleteSwapPreference, updateSwapPreference } from '../services/swapPreferencesService';
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


function MonthlyCalendar() {
  const { isWorker, getToken } = useAuth();
  const [, setToken] = useState(null); // 🆕 Nuevo state para el token
  const [shiftMap, setShiftMap] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM')); // ejemplo: "2025-04"
  const [monthDays, setMonthDays] = useState([]);
  const navigate = useNavigate();
  console.log('calendar profile:', isWorker);
  useEffect(() => {
    async function initialize() {
      if (isWorker) {
        const fetchedToken = await getToken();
        setToken(fetchedToken);
        fetchCalendar(isWorker.worker_id, fetchedToken);
      }
    }

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorker]);

  useEffect(() => {
    const start = startOfMonth(parseISO(selectedMonth + '-01'));
    const end = endOfMonth(parseISO(selectedMonth + '-01'));
    const days = eachDayOfInterval({ start, end });
    setMonthDays(days);
  }, [selectedMonth]);

  async function fetchCalendar(workerId, token) {
    /* const [year, month] = selectedMonth.split('-');
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(start);
    const days = eachDayOfInterval({ start, end });
    setMonthDays(days); */


    const [shiftsForMonth, publishedShifts, acceptedSwaps, preferences] = await Promise.all([
      getShiftsForMonth(workerId),
      getMyShifts(token),
      getAcceptedSwaps(token),
      getMySwapPreferences(workerId)
    ]);

    const enrichedMap = {};

    (shiftsForMonth || []).forEach(({ date, shift_type }) => {
      enrichedMap[date] = { shift_type: shift_type, isMyShift: true };
    });

    (publishedShifts || []).forEach(({ date, shift_type }) => {
      enrichedMap[date] = { shift_type: shift_type, isMyShift: true, isPublished: true };
    });

    acceptedSwaps.forEach(({ requester_id, offered_date, offered_type, shift }) => {
      if (offered_date) {
        enrichedMap[offered_date] = {
          ...enrichedMap[offered_date],
          shift_type: offered_type,
          isReceived: true
        };
      }

      if (shift && shift.date) {
        enrichedMap[shift.date] = {
          ...enrichedMap[shift.date],
          shift_type: shift.shift_type,
          isSwapped: true
        };
      }
    });


    (preferences || []).forEach(({ preference_id, date, preference_type }) => {
      if (!enrichedMap[date]) enrichedMap[date] = {};

      enrichedMap[date] = {
        ...enrichedMap[date],
        isPreference: true,
        preferenceId: preference_id,
        preference_type: preference_type,
        // 💥 importante
      };
    });

    console.log('enrichedMap turnos:', enrichedMap);
    // Guardamos sólo lo filtrado
    setShiftMap(enrichedMap);

  }
  useEffect(() => {
    console.log('calendar actualizado:', shiftMap);
  }, [shiftMap]);

  function handleMonthChange(event) {
    setSelectedMonth(event.target.value);
  }


  async function toggleShift(dateStr) {

    const entry = shiftMap[dateStr] || {};
    let newType = 'morning';

    if (entry.shift_type === 'morning') newType = 'evening';
    else if (entry.shift_type === 'evening') newType = 'night';
    else if (entry.shift_type === 'night') newType = null; // Borrar turno

    const updatedEntry = { ...entry };

    if (newType) {
      updatedEntry.isMyShift = true;
      updatedEntry.shift_type = newType;
    } else {
      delete updatedEntry?.isMyShift;
      delete updatedEntry?.shift_type;
    }

    setShiftMap(prev => ({
      ...prev,
      [dateStr]: updatedEntry,
    }));

    // 🛠️ Guardar en Supabase
    try {
      if (newType) {
        await setShiftForDay(isWorker.worker_id, dateStr, newType);
      } else {
        await removeShiftForDay(isWorker.worker_id, dateStr);
      }
    } catch (err) {
      console.error('Error saving shift:', err.message);
    }
  }


  async function togglePreference(dateStr) {

    const entry = shiftMap[dateStr] || {};
    let newTypePreference = 'morning';

    if (entry.preference_type === 'morning') newTypePreference = 'evening';
    else if (entry.preference_type === 'evening') newTypePreference = 'night';
    else if (entry.preference_type === 'night') newTypePreference = undefined; // Borrar preferencia

    const updatedEntry = { ...entry };

    if (newTypePreference) {
      updatedEntry.isPreference = true;
      updatedEntry.preference_type = newTypePreference;
    } else {
      delete updatedEntry.isPreference;
      delete updatedEntry.preference_type;
    }

    setShiftMap(prev => ({
      ...prev,
      [dateStr]: updatedEntry,

    }));
    // Guardar en Supabase
    try {
      if (newTypePreference) {
        // ✅ Solo guardamos si realmente cambió
        if (entry.preference_type !== newTypePreference) {
          if (entry.preferenceId) {
            await updateSwapPreference(entry.preferenceId, newTypePreference);
          } else {
            const preferenceCreated = await createSwapPreference({
              worker_id: isWorker.worker_id,
              date: dateStr,
              preference_type: newTypePreference,
              hospital_id: isWorker.workers_hospitals?.[0]?.hospital_id,
              speciality_id: isWorker.workers_specialities?.[0]?.speciality_id,
            });

            setShiftMap(prev => ({
              ...prev,
              [dateStr]: {
                ...prev[dateStr],
                preferenceId: preferenceCreated.preference_id,
              },
            }));
          }
        }
      } else {
        if (entry.preferenceId) {
          await deleteSwapPreference(entry.preferenceId);
        }
      }
    } catch (error) {
      console.error('Error gestionando preferencia:', error.message);
    }
  }


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendario de Turnos</h2>
      {/* Filtro de mes */}
      <div className="mb-4 flex justify-center">
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border p-2 rounded"
        />
      </div>

      {/* Cabecera de días de la semana */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dayName) => (
            <div key={dayName} className="calendar-header">{dayName}</div>
          ))}
          {Array.from({ length: getDayOffset(monthDays[0]) }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty" />
          ))}
          {/* Días reales */}
          {monthDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const entry = shiftMap[dateStr] || {};
            //const isToday = isSameDay(day, new Date());
            const shiftType = entry.shift_type || '';
            const flags = entry || {};
            const indicator = flags.isReceived
              ? '✅ Turno recibido'
              : flags.isSwapped
                ? '🔁 Turno traspasado'
                : flags.isPublished
                  ? '📢 Turno publicado'
                  : flags.isMyShift
                    ? '✔️'
                    : '';
            const isPast = day < new Date();

            return (
              <div
                key={dateStr}
                className={`calendar-day shift-${shiftType} ${isPast ? 'past' : ''}`}
              >
                <div className="day-number">{format(day, 'd')}{getShiftLabel(shiftType)} {indicator}</div>
                <div className="button-container">
                  {/* Turno propio */}
                  {!isBefore(day, new Date()) && entry.isMyShift && (
                    <div className="mt-1 text-green-700">
                      <button
                        className="publish-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShift(dateStr);
                        }}
                      >
                        Editar turno
                      </button>
                      {!entry.isPublished && (
                        <button
                          className="publish-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`);
                          }}
                        >
                          Publicar turno
                        </button>
                      )}
                    </div>
                  )}

                  {/* Preferencia */}
                  {!isBefore(day, new Date()) && entry.isPreference && (
                    <div className="mt-1 text-green-700">
                      Preferencia: {entry.preference_type?.charAt(0).toUpperCase()}
                      <button
                        className="publish-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreference(dateStr);
                        }}
                      >
                        Cambiar preferencia
                      </button>
                    </div>
                  )}
                  {!isBefore(day, new Date()) && !entry.isMyShift && !entry.isSwapped && (
                    <div className="mt-1 text-green-700">
                      <button
                        className="publish-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleShift(dateStr);
                        }}
                      >
                        Añadir turno
                      </button>
                    </div>
                  )}
                  {!isBefore(day, new Date()) && !entry.isPreference && (
                    <div className="mt-1 text-green-700">
                      <button
                        className="publish-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePreference(dateStr);
                        }}
                      >
                        Añadir preferencia
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MonthlyCalendar;
