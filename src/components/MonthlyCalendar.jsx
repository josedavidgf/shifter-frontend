// src/components/MonthlyCalendar.jsx (actualizado)
import { useEffect, useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, /* isSameDay, */ parseISO } from 'date-fns';
import { useCalendarApi } from '../api/useCalendarApi';
import { useSwapPreferencesApi } from '../api/useSwapPreferencesApi';
import { useSwapApi } from '../api/useSwapApi'; // Ya lo tenías
import { useShiftApi } from '../api/useShiftApi'; // Ya lo tenías
import { getDayOffset } from '../services/calendarService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MonthSelector from './MonthSelector';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button/Button'; // Ajusta ruta si necesario
import { buildMassiveUpdates } from '../utils/buildMassiveUpdates'; // ✅ Nuevo import
import { getNextShiftType } from '../utils/getNextShiftType';
import { getNextPreferenceType } from '../utils/getNextPreferenceType';
import DayDetailMyShift from './DayDetails/DayDetailMyShift';
import DayDetailPreference from './DayDetails/DayDetailPreference';
import DayDetailReceived from './DayDetails/DayDetailReceived';
import DayDetailSwapped from './DayDetails/DayDetailSwapped';
import DayDetailEmpty from './DayDetails/DayDetailEmpty';
import Loader from '../components/ui/Loader/Loader'; // ✅



function getShiftLabel(shift) {
  switch (shift) {
    case 'morning':
      return '☀️';
    case 'evening':
      return '🌤️';
    case 'night':
      return '🌛';
    case 'reinforcement':
      return '🛡️';
    default:
      return '';
  }
}

function computeShiftStats(shiftMap, selectedMonth) {
  const stats = {
    morning: 0,
    evening: 0,
    night: 0,
    reinforcement: 0,
    total: 0, // nuevo!
  };

  for (const [date, entry] of Object.entries(shiftMap)) {
    if (!date.startsWith(selectedMonth)) continue;

    if ((entry.isMyShift || entry.isReceived) && entry.shift_type) {
      if (stats.hasOwnProperty(entry.shift_type)) {
        stats[entry.shift_type]++;
        stats.total++; // aumentamos el total
      }
    }
  }

  return stats;
}



function MonthlyCalendar() {

  const [isMassiveEditMode, setIsMassiveEditMode] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
  const [draftShiftMap, setDraftShiftMap] = useState(null);
  const [selectedDay, setSelectedDay] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [shiftMap, setShiftMap] = useState({});
  const { isWorker, getToken } = useAuth();
  const [, setToken] = useState(null); // 🆕 Nuevo state para el token
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM')); // ejemplo: "2025-04"
  const [monthDays, setMonthDays] = useState([]);
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd'); // formato '2025-04-22'
  const stats = computeShiftStats(isMassiveEditMode ? draftShiftMap : shiftMap, selectedMonth);
  const detailRef = useRef(null);
  const { getShiftsForMonth, setShiftForDay, removeShiftForDay, loading: loadingCalendar, error: errorCalendar } = useCalendarApi();
  const { getMySwapPreferences, createSwapPreference, deleteSwapPreference, updateSwapPreference, loading: loadingSwapPreferences, error: errorSwapPreferences } = useSwapPreferencesApi();
  const { getAcceptedSwaps } = useSwapApi();
  const { getMyShiftsPublished, removeShift } = useShiftApi();


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
    try {
      setIsLoadingCalendar(true);

      const results = await Promise.allSettled([
        getShiftsForMonth(workerId),             // ✅ useCalendarApi
        getMyShiftsPublished(token),              // ✅ useShiftApi
        getAcceptedSwaps(token),                  // ✅ useSwapApi
        getMySwapPreferences(workerId),           // ✅ useSwapPreferencesApi
      ]);

      const shiftsForMonth = results[0].status === 'fulfilled' ? results[0].value : [];
      const publishedShifts = results[1].status === 'fulfilled' ? results[1].value : [];
      const acceptedSwaps = results[2].status === 'fulfilled' ? results[2].value : [];
      const preferences = results[3].status === 'fulfilled' ? results[3].value : [];

      if (results[0].status === 'rejected') console.error('❌ Error cargando turnos del mes:', results[0].reason.message);
      if (results[1].status === 'rejected') console.error('❌ Error cargando turnos publicados:', results[1].reason.message);
      if (results[2].status === 'rejected') console.error('❌ Error cargando swaps aceptados:', results[2].reason.message);
      if (results[3].status === 'rejected') console.error('❌ Error cargando preferencias:', results[3].reason.message);

      const enrichedMap = {};

      (shiftsForMonth || []).forEach(({ date, shift_type }) => {
        enrichedMap[date] = { shift_type: shift_type, isMyShift: true };
      });

      (publishedShifts || []).forEach(({ date, shift_type, shift_id }) => {
        enrichedMap[date] = { shift_id: shift_id, shift_type: shift_type, isMyShift: true, isPublished: true };
      });

      (acceptedSwaps || []).forEach(({ requester, offered_date, offered_type, shift }) => {
        if (offered_date) {
          enrichedMap[offered_date] = {
            ...enrichedMap[offered_date],
            shift_type: offered_type,
            requester_name: requester?.name || '',
            requester_surname: requester?.surname || '',
            isReceived: true
          };
        }
        if (shift && shift.date) {
          enrichedMap[shift.date] = {
            ...enrichedMap[shift.date],
            shift_type: enrichedMap[shift.date]?.shift_type || '', // 👈 solo si no hay
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
        };
      });

      setShiftMap(enrichedMap);

    } catch (error) {
      console.error('❌ Error general en fetchCalendar:', error.message);
    } finally {
      setIsLoadingCalendar(false);
    }
  }



  useEffect(() => {
  }, [shiftMap]);


  function handleDayClick(dateStr) {
    if (dateStr < today) return;

    if (isMassiveEditMode) {
      const entry = draftShiftMap[dateStr] || {};

      if (entry.isReceived || entry.isPreference) return;

      let newType = 'morning';

      switch (entry.shift_type) {
        case 'morning':
          newType = 'evening';
          break;
        case 'evening':
          newType = 'night';
          break;
        case 'night':
          newType = 'reinforcement';
          break;
        case 'reinforcement':
          newType = null;
          break;
        default:
          newType = 'morning';
      }

      if (!newType) {
        // Eliminar el día del draft si ya no hay shift_type
        const updatedDraft = { ...draftShiftMap };
        delete updatedDraft[dateStr];
        setDraftShiftMap(updatedDraft);
      } else {
        const updatedEntry = {
          ...entry,
          isMyShift: true,
          shift_type: newType,
        };

        setDraftShiftMap(prev => ({
          ...prev,
          [dateStr]: updatedEntry,
        }));
      }

    } else {
      setSelectedDay(dateStr);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }


  async function handleSaveMassiveEdit() {
    try {
      const VALID_SHIFT_TYPES = ['morning', 'evening', 'night', 'reinforcement'];

      const updates = Object.entries(draftShiftMap)
        .filter(([dateStr, entry]) => {
          return entry.shift_type && VALID_SHIFT_TYPES.includes(entry.shift_type);
        })
        .map(([dateStr, entry]) => {
          return setShiftForDay(isWorker.worker_id, dateStr, entry.shift_type);
        });

      await Promise.all(updates);

      setShiftMap(draftShiftMap);
      setDraftShiftMap(null);
      setIsMassiveEditMode(false);
    } catch (error) {
      console.error('❌ Error guardando cambios masivos:', error.message);
    }
  }


  async function toggleShift(dateStr) {
    const entry = shiftMap[dateStr] || {};
    const newType = getNextShiftType(entry.shift_type);

    const updatedEntry = { ...entry };

    if (newType) {
      updatedEntry.isMyShift = true;
      updatedEntry.shift_type = newType;
    } else {
      delete updatedEntry.isMyShift;
      delete updatedEntry.shift_type;
    }

    setShiftMap(prev => ({
      ...prev,
      [dateStr]: updatedEntry,
    }));

    try {
      if (newType) {
        await setShiftForDay(isWorker.worker_id, dateStr, newType); // ✅ Desde useCalendarApi
      } else {
        await removeShiftForDay(isWorker.worker_id, dateStr); // ✅ Desde useCalendarApi
      }
    } catch (error) {
      console.error('❌ Error gestionando turno:', error.message);
    }
  }



  async function togglePreference(dateStr) {
    const entry = shiftMap[dateStr] || {};
    const newTypePreference = getNextPreferenceType(entry.preference_type);

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

    try {
      if (newTypePreference) {
        if (entry.preference_type !== newTypePreference) {
          if (entry.preferenceId) {
            await updateSwapPreference(entry.preferenceId, newTypePreference); // ✅ Desde useSwapPreferencesApi
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
          await deleteSwapPreference(entry.preferenceId); // ✅ Desde useSwapPreferencesApi
        }
      }
    } catch (error) {
      console.error('❌ Error gestionando preferencia:', error.message);
    }
  }

  async function handleDeletePreference(dateStr) {
    const entry = shiftMap[dateStr];

    if (!entry?.preferenceId) {
      console.error('No existe preferencia para eliminar.');
      return;
    }

    try {
      await deleteSwapPreference(entry.preferenceId); // ✅ desde useSwapPreferencesApi

      const updatedEntry = { ...entry };
      delete updatedEntry.isPreference;
      delete updatedEntry.preferenceId;
      delete updatedEntry.preference_type;

      setShiftMap(prev => ({
        ...prev,
        [dateStr]: updatedEntry,
      }));
    } catch (error) {
      console.error('❌ Error al eliminar preferencia:', error.message);
    }
  }


  async function handleDeletePublication(shiftId, dateStr) {
    try {
      const token = await getToken(); // ✅ Obtener token antes
      const success = await removeShift(shiftId, token); // ✅ Pasar token
  
      if (success) {
        const updatedEntry = { ...shiftMap[dateStr] };
        delete updatedEntry.isPublished;
        delete updatedEntry.shift_id;
  
        setShiftMap(prev => ({
          ...prev,
          [dateStr]: updatedEntry,
        }));
      }
    } catch (error) {
      console.error('❌ Error al eliminar publicación:', error.message);
    }
  }
  

  // Función para Publicar un turno de un día específico de forma rápida
  /*   async function handlePublishShift(dateStr) {
      try {
        const entry = shiftMap[dateStr];
    
        if (!entry?.shift_type) {
          console.error('No se puede publicar turno sin tipo definido.');
          return;
        }
    
        const payload = {
          worker_id: isWorker.worker_id,
          date: dateStr,
          shift_type: entry.shift_type,
          status: 'published',
          source: 'calendar',
        };
    
        const createdShift = await createShift(payload, token); // ✅ usando useShiftApi
    
        if (createdShift) {
          setShiftMap(prev => ({
            ...prev,
            [dateStr]: {
              ...prev[dateStr],
              shift_id: createdShift.shift_id,
              isPublished: true,
            },
          }));
        }
      } catch (error) {
        console.error('❌ Error al publicar turno:', error.message);
      }
    } */



  async function handleRemoveShiftForDay(dateStr) {
    try {
      const token = await getToken(); // Aunque para calendarService no uses token explícito
      await removeShiftForDay(isWorker.worker_id, dateStr);
      await fetchCalendar(isWorker.worker_id, token); // Recarga el calendario
      setSelectedDay(dateStr);
    } catch (error) {
      console.error('Error eliminando turno del día:', error.message);
    }
  }


  function renderDayDetails(dateStr) {
    const dataForRender = isMassiveEditMode ? draftShiftMap : shiftMap;
    const entry = dataForRender[dateStr] || {};
    const dayLabel = format(parseISO(dateStr), 'dd/MM/yyyy');

    if (entry.isMyShift) {
      return (
        <DayDetailMyShift
          dateStr={dateStr}
          entry={entry}
          dayLabel={dayLabel}
          onDeletePublication={handleDeletePublication}
          onRemoveShift={handleRemoveShiftForDay}
          onEditShift={toggleShift}
          navigate={navigate}
        />
      );
    }

    if (entry.isPreference) {
      return (
        <DayDetailPreference
          dateStr={dateStr}
          entry={entry}
          dayLabel={dayLabel}
          onEditPreference={togglePreference}
          onDeletePreference={handleDeletePreference}
        />
      );
    }

    if (entry.isReceived) {
      return (
        <DayDetailReceived
          dateStr={dateStr}
          entry={entry}
          dayLabel={dayLabel}
          navigate={navigate}
        />
      );
    }

    if (entry.isSwapped) {
      return (
        <DayDetailSwapped
          dateStr={dateStr}
          dayLabel={dayLabel}
          onAddShift={toggleShift}
          onAddPreference={togglePreference}
        />
      );
    }

    return (
      <DayDetailEmpty
        dateStr={dateStr}
        dayLabel={dayLabel}
        onAddShift={toggleShift}
        onAddPreference={togglePreference}
      />
    );
  }

  if (isLoadingCalendar) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader text="Cargando tu calendario..." />
      </div>
    );
  }

  if (errorCalendar || errorSwapPreferences) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error al cargar tu calendario.</p>
      </div>
    );
  }

  console.log('ShiftMap:', shiftMap);

  return (
    <>
      {/* Filtro de mes */}
      <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />


      {!isMassiveEditMode ? (
        <Button
          label="Generar turnos masivo"
          variant="primary"
          size="lg"
          onClick={() => {
            setDraftShiftMap({ ...shiftMap }); // Creamos copia
            setIsMassiveEditMode(true);
          }}
        />

      ) : (
        <div className="btn-group">
          <Button
            label="Guardar cambios"
            variant="primary"
            size="md"
            onClick={handleSaveMassiveEdit}
          />
          <Button
            label="Descartar cambios"
            variant="danger"
            size="md"
            onClick={() => {
              setDraftShiftMap(null);
              setIsMassiveEditMode(false);
            }}
          />
        </div>
      )}

      <div className="mb-4 p-4 border rounded shadow">
        <div className="badge-container">
          {['morning', 'evening', 'night', 'reinforcement'].map((type) => {
            const count = stats[type];
            const icons = {
              morning: '🔆',
              evening: '🌇',
              night: '🌙',
              reinforcement: '🆘',
            };

            const labelMap = {
              morning: 'M',
              evening: 'T',
              night: 'N',
              reinforcement: 'R',
            };

            return (
              <div key={type} className="stat-badge">
                <span className="badge-icon">{icons[type]}</span>
                <span className="badge-count">{count}</span>
                <span className="badge-label">{labelMap[type]}</span>
              </div>
            );
          })}
        </div>
      </div>



      {/* Cabecera de días de la semana */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMonth}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="calendar-grid"
        >
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((dayName) => (
            <div key={dayName} className="calendar-header">{dayName}</div>
          ))}
          {Array.from({ length: getDayOffset(monthDays[0]) }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty" />
          ))}
          {/* Días reales */}
          {monthDays.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dataForRender = isMassiveEditMode ? draftShiftMap : shiftMap;
            const entry = dataForRender[dateStr] || {};
            //const isToday = isSameDay(day, new Date());
            const shiftType = entry.shift_type || '';
            const flags = entry || {};
            const indicator = flags.isReceived
              ? '✅'
              : flags.isSwapped
                ? '🔁'
                : flags.isPublished
                  ? '📢'
                  : flags.isMyShift
                    ? '✔️'
                    : '';
            const isPast = format(day, 'yyyy-MM-dd') < today;

            return (
              <div
                key={dateStr}
                className={`calendar-day shift-${shiftType} ${isPast ? 'past' : ''} ${selectedDay === dateStr ? 'selected-day' : ''}`}
                onClick={() => handleDayClick(dateStr)}
              >
                <div className="day-number">{format(day, 'd')} {getShiftLabel(shiftType)} {indicator}</div>

              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>
      {selectedDay && (
        <div
          ref={detailRef}
          className="day-details mt-4 p-4 border rounded shadow">
          {renderDayDetails(selectedDay)}
        </div>
      )}
    </>
  );
}

export default MonthlyCalendar;
