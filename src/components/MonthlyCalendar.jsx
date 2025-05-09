// src/components/MonthlyCalendar.jsx (actualizado)
import { useEffect, useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, /* isSameDay, */ parseISO, addDays } from 'date-fns';
import { isToday } from 'date-fns';
import es from 'date-fns/locale/es';
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
import { buildMassiveUpdates } from '../utils/buildMassiveUpdates'; //
import { getNextShiftType } from '../utils/getNextShiftType';
import { getNextPreferenceType } from '../utils/getNextPreferenceType';
import DayDetailMyShift from './DayDetails/DayDetailMyShift';
import DayDetailPreference from './DayDetails/DayDetailPreference';
import DayDetailReceived from './DayDetails/DayDetailReceived';
import DayDetailSwapped from './DayDetails/DayDetailSwapped';
import DayDetailEmpty from './DayDetails/DayDetailEmpty';
import Loader from '../components/ui/Loader/Loader';
import Banner from '../components/ui/Banner/Banner';
import { Sun, SunHorizon, Moon, ShieldCheck, CirclesThree, SquaresFour, Stack, Trash, FloppyDisk, CalendarPlus } from '../theme/icons';
import { Fire, FireSimple, ChartPieSlice, ChartBar, ChartLine, ChartBarHorizontal, ChartLineUp } from 'phosphor-react';
import { useToast } from '../hooks/useToast'; // ya lo usas en otras vistas
import { Check } from 'phosphor-react';
import { formatFriendlyDate } from '../utils/formatFriendlyDate';


function renderShiftIcon(shift) {
  switch (shift) {
    case 'morning':
      return <Sun size={16} />;
    case 'evening':
      return <SunHorizon size={16} />;
    case 'night':
      return <Moon size={16} />;
    case 'reinforcement':
      return <Fire size={16} />;
    case 'total':
      return <Stack size={16} />;
    default:
      return null;
  }
}


function computeShiftStats(shiftMap, selectedMonth) {
  const stats = {
    morning: 0,
    evening: 0,
    night: 0,
    reinforcement: 0,
    total: 0,
  };

  for (const [date, entry] of Object.entries(shiftMap)) {
    if (!date.startsWith(selectedMonth)) continue;

    if (entry.shift_type && entry.source !== 'swapped_out') {
      if (stats.hasOwnProperty(entry.shift_type)) {
        stats[entry.shift_type]++;
        stats.total++;
      }
    }
  }

  return stats;
}



function MonthlyCalendar() {

  const [isMassiveEditMode, setIsMassiveEditMode] = useState(false);
  const [showStats, setShowStats] = useState(true);
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
  const { showError, showSuccess } = useToast();
  const [loadingMassiveSave, setLoadingMassiveSave] = useState(false);
  const [loadingToggleShift, setLoadingToggleShift] = useState(false);
  const [loadingTogglePreference, setLoadingTogglePreference] = useState(false);
  const [loadingDeletePreference, setLoadingDeletePreference] = useState(false);
  const [loadingDeletePublication, setLoadingDeletePublication] = useState(false);
  const [loadingRemoveShift, setLoadingRemoveShift] = useState(false);
  const [showMassiveEditBanner, setShowMassiveEditBanner] = useState(false);



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
        getShiftsForMonth(workerId),         // 📅 monthly_schedules
        getMySwapPreferences(workerId),      // ✅ preferencias
        getMyShiftsPublished(token),         // 🔍 sólo para isPublished
      ]);

      const schedules = results[0].status === 'fulfilled' ? results[0].value : [];
      const preferences = results[1].status === 'fulfilled' ? results[1].value : [];
      const publishedShifts = results[2].status === 'fulfilled' ? results[2].value : [];

      const errors = [];

      if (results[0].status === 'rejected') {
        console.error('❌ Error cargando schedules:', results[0].reason.message);
        errors.push('turnos');
      }
      if (results[1].status === 'rejected') {
        console.error('❌ Error cargando preferencias:', results[1].reason.message);
        errors.push('preferencias');
      }
      if (results[2].status === 'rejected') {
        console.error('❌ Error cargando publicaciones:', results[2].reason.message);
        errors.push('turnos publicados');
      }

      if (errors.length > 0) {
        showError(`Error al cargar: ${errors.join(', ')}`);
      }


      const publishedMap = new Map();
      publishedShifts.forEach(s => {
        publishedMap.set(`${s.date}_${s.shift_type}`, s.shift_id);
      });


      const enrichedMap = {};

      schedules.forEach(({ date, shift_type, source, related_worker_id, related_worker, swap_id }) => {
        const key = `${date}_${shift_type}`;
        const hasRelated = !!related_worker_id && related_worker;

        enrichedMap[date] = {
          shift_type,
          source,
          related_worker_id,
          related_worker_name: hasRelated ? related_worker.name : null,
          related_worker_surname: hasRelated ? related_worker.surname : null,
          related_worker, // 👈 se añade el objeto completo
          swap_id,
          isPublished: publishedMap.has(key),
          shift_id: publishedMap.get(key) || null,
          worker_id: workerId, // 👈 nuevo campo añadido
        };
      });

      preferences.forEach(({ preference_id, date, preference_type }) => {
        if (!enrichedMap[date]) enrichedMap[date] = {};

        const entry = enrichedMap[date];

        const prevTypes = entry.preference_types || [];
        const prevIds = entry.preferenceIds || {};

        enrichedMap[date] = {
          ...entry,
          isPreference: true,
          preference_types: [...prevTypes, preference_type],
          preferenceIds: { ...prevIds, [preference_type]: preference_id },
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

      if (entry.source === 'received_swap' || entry.isPreference) return;

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
    setLoadingMassiveSave(true);
    try {
      const VALID_SHIFT_TYPES = ['morning', 'evening', 'night', 'reinforcement'];

      const updates = Object.entries(draftShiftMap)
        .filter(([dateStr, entry]) => {
          return (
            entry.shift_type &&
            VALID_SHIFT_TYPES.includes(entry.shift_type) &&
            entry.source !== 'received_swap'
          );
        })
        .map(([dateStr, entry]) => {
          // ✅ Añadimos el source: 'manual' antes de guardar
          draftShiftMap[dateStr] = {
            ...entry,
            source: 'manual',
          };

          return setShiftForDay(isWorker.worker_id, dateStr, entry.shift_type);
        });

      await Promise.all(updates);

      setShiftMap(draftShiftMap);
      setDraftShiftMap(null);
      setIsMassiveEditMode(false);
      showSuccess('Cambios guardados correctamente');
    } catch (error) {
      console.error('❌ Error guardando cambios masivos:', error.message);
      showError('Error guardando los cambios');
    } finally {
      setLoadingMassiveSave(false);
    }
  }


  async function toggleShift(dateStr) {
    const entry = shiftMap[dateStr] || {};
    const newType = getNextShiftType(entry.shift_type);
    const updatedEntry = { ...entry };

    if (newType) {
      updatedEntry.source = 'manual';
      updatedEntry.shift_type = newType;
    } else {
      delete updatedEntry.source;
      delete updatedEntry.shift_type;
    }

    setShiftMap(prev => ({
      ...prev,
      [dateStr]: updatedEntry,
    }));

    setLoadingToggleShift(true);
    try {
      if (newType) {
        await setShiftForDay(isWorker.worker_id, dateStr, newType); // ✅ Desde useCalendarApi
        showSuccess(`Turno actualizado para ${formatFriendlyDate(dateStr)}`);
      } else {
        await removeShiftForDay(isWorker.worker_id, dateStr); // ✅ Desde useCalendarApi
        showSuccess(`Turno eliminado en ${formatFriendlyDate(dateStr)}`);
      }
    } catch (error) {
      console.error('❌ Error gestionando turno:', error.message);
      showError('Error al actualizar el turno');
    } finally {
      setLoadingToggleShift(false);
    }
  }



  async function togglePreference(dateStr, shiftType) {
    setLoadingTogglePreference(true);
    try {
      const entry = shiftMap[dateStr] || {};

      const currentTypes = entry.preference_types || [];
      const currentIds = entry.preferenceIds || {};

      const alreadyExists = currentTypes.includes(shiftType);

      let updatedTypes = [...currentTypes];
      let updatedIds = { ...currentIds };

      if (alreadyExists) {
        const preferenceId = currentIds[shiftType];
        if (preferenceId) {
          await deleteSwapPreference(preferenceId);
          updatedTypes = updatedTypes.filter(t => t !== shiftType);
          delete updatedIds[shiftType];
        }
      } else {
        const res = await createSwapPreference({
          worker_id: isWorker.worker_id,
          date: dateStr,
          preference_type: shiftType,
          hospital_id: isWorker.workers_hospitals?.[0]?.hospital_id,
          speciality_id: isWorker.workers_specialities?.[0]?.speciality_id,
        });
        updatedTypes.push(shiftType);
        updatedIds[shiftType] = res.preference_id;
      }

      const updatedEntry = {
        ...entry,
        isPreference: updatedTypes.length > 0,
        preference_types: updatedTypes,
        preferenceIds: updatedIds,
      };

      setShiftMap(prev => ({
        ...prev,
        [dateStr]: updatedEntry,
      }));
    } catch (error) {
      console.error('❌ Error gestionando preferencia:', error.message);
      showError('Error al actualizar la preferencia');
    } finally {
      setLoadingTogglePreference(false);
    }
  }


  async function handleDeletePreference(dateStr) {
    const entry = shiftMap[dateStr];
    const preferenceIds = entry?.preferenceIds;

    if (!preferenceIds || Object.keys(preferenceIds).length === 0) {
      console.warn('❌ No hay preferencias que eliminar.');
      return;
    }

    setLoadingDeletePreference(true);

    try {
      // Borramos todas las preferencias activas del día
      await Promise.all(
        Object.values(preferenceIds).map(id => deleteSwapPreference(id))
      );

      // Limpiar el estado del shiftMap
      const updatedEntry = { ...entry };
      delete updatedEntry.isPreference;
      delete updatedEntry.preferenceIds;
      delete updatedEntry.preference_types;

      setShiftMap(prev => ({
        ...prev,
        [dateStr]: updatedEntry,
      }));

      showSuccess(`Preferencias eliminadas para ${formatFriendlyDate(dateStr)}`);
    } catch (error) {
      console.error('❌ Error al eliminar todas las preferencias:', error.message);
      showError('Error al eliminar las disponibilidades');
    } finally {
      setLoadingDeletePreference(false);
    }
  }



  async function handleDeletePublication(shiftId, dateStr) {
    if (!shiftId) {
      showError('No se encontró el turno para eliminar la publicación.');
      return;
    }

    setLoadingDeletePublication(true);
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
        })); showSuccess(`Turno despublicado correctamente para ${formatFriendlyDate(dateStr)}`);
      } else {
        showError('No se pudo eliminar la publicación');
      }
    } catch (error) {
      console.error('❌ Error al eliminar publicación:', error.message);
      showError('Error al eliminar la publicación del turno');
    } finally {
      setLoadingDeletePublication(false);
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
    const entry = shiftMap[dateStr];

    if (!entry?.shift_type) {
      showError('No hay turno asignado para este día');
      return;
    }
    setLoadingRemoveShift(true);

    try {
      await removeShiftForDay(isWorker.worker_id, dateStr);

      const updatedEntry = { ...shiftMap[dateStr] };
      delete updatedEntry.shift_type;
      delete updatedEntry.source;

      setShiftMap(prev => ({
        ...prev,
        [dateStr]: updatedEntry,
      }));

      setSelectedDay(dateStr);
      showSuccess(`Turno eliminado para el ${formatFriendlyDate(dateStr)}`);
    } catch (error) {
      console.error('Error eliminando turno del día:', error.message);
      showError('Error al eliminar el turno');
    } finally {
      setLoadingRemoveShift(false);
    }
  }



  function renderDayDetails(dateStr) {
    const dataForRender = isMassiveEditMode ? draftShiftMap : shiftMap;
    const entry = dataForRender[dateStr] || {};
    const parsedDate = parseISO(dateStr);
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const tomorrow = addDays(new Date(), 1);
    const dayLabel = isToday(parsedDate)
      ? `Hoy, ${format(parsedDate, 'dd/MM')}`
      : format(parsedDate, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')
        ? `Mañana, ${format(parsedDate, 'dd/MM')}`
        : `${capitalize(format(parsedDate, 'EEEE', { locale: es }))}, ${format(parsedDate, 'dd/MM')}`;

    const { source, isPreference, isPublished } = entry;
    if (source === 'manual') {
      return (
        <DayDetailMyShift
          dateStr={dateStr}
          entry={entry}
          dayLabel={dayLabel}
          isPublished={isPublished}
          onDeletePublication={handleDeletePublication}
          onRemoveShift={handleRemoveShiftForDay}
          onEditShift={toggleShift}
          navigate={navigate}
          loadingDeletePublication={loadingDeletePublication}
          loadingRemoveShift={loadingRemoveShift}
        />
      );
    }

    if (isPreference && !entry.shift_type) {
      return (
        <DayDetailPreference
          dateStr={dateStr}
          entry={entry}
          dayLabel={dayLabel}
          onEditPreference={togglePreference}
          onDeletePreference={handleDeletePreference}
          loadingDeletePreference={loadingDeletePreference}
        />
      );
    }

    if (source === 'received_swap') {
      return (
        <DayDetailReceived
          dateStr={dateStr}
          entry={entry}
          dayLabel={dayLabel}
          navigate={navigate}
        />
      );
    }

    if (source === 'swapped_out') {
      return (
        <DayDetailSwapped
          dateStr={dateStr}
          dayLabel={dayLabel}
          entry={entry}
          navigate={navigate}
          onAddShift={toggleShift}
          onAddPreference={(dateStr) => togglePreference(dateStr, 'morning')}
        />
      );
    }

    return (
      <DayDetailEmpty
        dateStr={dateStr}
        dayLabel={dayLabel}
        onAddShift={toggleShift}
        onAddPreference={(dateStr) => togglePreference(dateStr, 'morning')}
      />
    );
  }


  if (isLoadingCalendar) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader text="Cargando tu AAAA..." minTime={1000}/>
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


  return (
    <>
      <div className="month-selector-group">
        <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
        {!isMassiveEditMode && (
          <div className="month-selector-actions">
            <Button
              variant="outline"
              leftIcon={<ChartPieSlice size={20} weight={showStats ? 'regular' : 'fill'} color={showStats ? undefined : '#1F2937'} />}
              size="sm"
              onClick={() => setShowStats(prev => !prev)}
            />
            <Button
              variant="outline"
              leftIcon={<CalendarPlus size={20} weight="fill" />}
              size="sm"
              onClick={() => {
                setDraftShiftMap({ ...shiftMap });
                setIsMassiveEditMode(true);
                setSelectedDay(null);
                setShowMassiveEditBanner(true);
              }}
            />
          </div>
        )}
      </div>
      {showMassiveEditBanner && isMassiveEditMode && (
        <Banner type="info" onClose={() => setShowMassiveEditBanner(false)}>
          Haz clic varias veces para alternar entre mañana, tarde, noche o refuerzo.
        </Banner>
      )}
      {showStats && (
        <div className="mt-3 mb-3 p-4 border rounded shadow">
          <div className="badge-container">
            {['total', 'morning', 'evening', 'night', 'reinforcement'].map((type) => {
              const count = stats[type];
              return (
                <div key={type} className="stat-badge">
                  <span className="badge-icon">{renderShiftIcon(type)}</span>
                  <span className="badge-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="calendar-grid-container">
        <div className="calendar-header-container">
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
            <div className="calendar-header-day" key={day}>
              <span className="calendar-header-day-text">{day}</span>
            </div>
          ))}
        </div>

        <div className="calendar-month-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMonth}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}
            >
              {Array.from({ length: getDayOffset(monthDays[0]) }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day-container empty" />
              ))}
              {monthDays.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dataForRender = isMassiveEditMode ? draftShiftMap : shiftMap;
                const entry = dataForRender[dateStr] || {};
                const shiftType = entry.shift_type || '';
                const isSwappedOut = entry.source === 'swapped_out';
                const flags = entry || {};
                const todayDate = new Date();
                const isPast = day < todayDate;
                const isSelected = selectedDay === dateStr;


                /*Por ahora descartamos el indicador de estado, pero lo dejamos comentado para el futuro*/
                /* let indicator = '';

                if (flags.isReceived) indicator += '✅';
                if (flags.isSwapped) indicator += '🔁';
                if (flags.isPublished) indicator += '📢';
                if (flags.isMyShift) indicator += '✔️';
                if (!flags.isMyShift && flags.isPreference) indicator += '🟢'; // ✅ Aquí controlamos tu caso
 */
                const showAvailability = (!entry.source || entry.source === null) && entry.isPreference;

                return (
                  <div
                    key={dateStr}
                    className={`calendar-day-container ${!isSwappedOut ? `shift-${shiftType}` : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected-day' : ''}`}
                    onClick={() => handleDayClick(dateStr)}
                  >
                    <div className="calendar-day-number">{format(day, 'd')}{/* {getShiftLabel(shiftType)} {indicator} */}</div>
                    <div className="calendar-shift-icon">
                      {!isSwappedOut && renderShiftIcon(shiftType)}
                    </div>
                    {showAvailability && (
                      <div className="calendar-availability-dot" />
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {!isMassiveEditMode && selectedDay && (
        <div
          ref={detailRef}
          className="day-details mt-4 p-4 border rounded shadow"
        >
          {renderDayDetails(selectedDay)}
        </div>
      )}
      {isMassiveEditMode && (

        <div className="btn-group-row mt-3">
          <Button
            label="Aplicar"
            variant="primary"
            leftIcon={<Check size={24} />}
            size="md"
            onClick={handleSaveMassiveEdit}
            isLoading={loadingMassiveSave}
            disabled={loadingMassiveSave} />
          <Button
            label="Descartar"
            variant="danger"
            size="md"
            leftIcon={<Trash size={24} />}
            onClick={() => {
              setDraftShiftMap(null);
              setIsMassiveEditMode(false);
            }}
          />
        </div>
      )}

    </>
  );
}

export default MonthlyCalendar;
