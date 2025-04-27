// src/components/MonthlyCalendar.jsx (actualizado)
import { useEffect, useState, useRef } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, /* isSameDay, */ parseISO } from 'date-fns';
import { getShiftsForMonth, setShiftForDay, removeShiftForDay, getDayOffset } from '../services/calendarService';
import { getAcceptedSwaps } from '../services/swapService';
import { getMyShiftsPublished, removeShift } from '../services/shiftService';
import { getMySwapPreferences, createSwapPreference, deleteSwapPreference, updateSwapPreference } from '../services/swapPreferencesService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MonthSelector from './MonthSelector';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button/Button'; // Ajusta ruta si necesario
import { Lightning } from '../theme/icons';



function getShiftLabel(shift) {
  switch (shift) {
    case 'morning':
      return '☀️';
    case 'evening':
      return '🌤️';
    case 'night':
      return '🌛';
    case 'morning_afternoon':
      return 'MT';
    case 'morning_night':
      return 'MN';
    case 'afternoon_night':
      return 'TN';
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
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
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
      setIsLoadingCalendar(true); // 🛠️ Empezamos carga
      /* const [year, month] = selectedMonth.split('-');
      const start = startOfMonth(new Date(year, month - 1));
      const end = endOfMonth(start);
      const days = eachDayOfInterval({ start, end });
      setMonthDays(days); */

      // Aquí se obtiene el calendario del mes seleccionado
      const [shiftsForMonth, publishedShifts, acceptedSwaps, preferences] = await Promise.all([
        getShiftsForMonth(workerId),
        getMyShiftsPublished(token),
        getAcceptedSwaps(token),
        getMySwapPreferences(workerId)
      ]);

      const enrichedMap = {};

      (shiftsForMonth || []).forEach(({ date, shift_type }) => {
        enrichedMap[date] = { shift_type: shift_type, isMyShift: true };
      });

      (publishedShifts || []).forEach(({ date, shift_type, shift_id }) => {
        enrichedMap[date] = { shift_id: shift_id, shift_type: shift_type, isMyShift: true, isPublished: true };
      });

      acceptedSwaps.forEach(({ requester, offered_date, offered_type, shift }) => {
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
            shift_type: '',
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

      // Guardamos sólo lo filtrado
      setShiftMap(enrichedMap);

    } catch (error) {
      console.error('❌ Error en fetchCalendar:', error.message);
    } finally {
      setIsLoadingCalendar(false); // 🛠️ Finalizamos carga
    }
  }
  useEffect(() => {
  }, [shiftMap]);


  function handleDayClick(dateStr) {
    if (dateStr < today) return;

    if (isMassiveEditMode) { // Solo en modo edición

      const entry = draftShiftMap[dateStr] || {};

      // Restricciones:
      if (entry.isReceived) return; // No puedes modificar turnos recibidos
      if (entry.isPreference) return; // No puedes añadir turno donde tienes preferencia

      // Lógica de rotar tipo de turno
      let newType = 'morning'; // Tipo inicial

      switch (entry.shift_type) {
        case 'morning':
          newType = 'evening';
          break;
        case 'evening':
          newType = 'night';
          break;
        case 'night':
          newType = 'morning_afternoon';
          break;
        case 'morning_afternoon':
          newType = 'morning_night';
          break;
        case 'morning_night':
          newType = 'afternoon_night';
          break;
        case 'afternoon_night':
          newType = 'reinforcement';
          break;
        case 'reinforcement':
          newType = null;
          break;
        default:
          newType = 'morning';
      }

      const updatedEntry = { ...entry };

      if (newType) {
        updatedEntry.isMyShift = true;
        updatedEntry.shift_type = newType;
      } else {
        delete updatedEntry?.isMyShift;
        delete updatedEntry?.shift_type;
      }

      setDraftShiftMap(prev => ({
        ...prev,
        [dateStr]: updatedEntry,
      }));
    }
    else {
      setSelectedDay(dateStr);
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    }
  }

  async function handleSaveMassiveEdit() {
    try {
      const updates = [];

      for (const [date, entry] of Object.entries(draftShiftMap)) {
        const originalEntry = shiftMap[date] || {};

        if (JSON.stringify(entry) !== JSON.stringify(originalEntry)) {
          if (entry.isMyShift && entry.shift_type) {
            updates.push(setShiftForDay(isWorker.worker_id, date, entry.shift_type));
          } else if (!entry.isMyShift && originalEntry.isMyShift) {
            updates.push(removeShiftForDay(isWorker.worker_id, date));
          }
        }
      }

      await Promise.all(updates);

      setShiftMap(draftShiftMap); // Actualizamos el calendario real
      setDraftShiftMap(null);
      setIsMassiveEditMode(false);

    } catch (error) {
      console.error('Error guardando cambios:', error.message);
    }
  }

  async function toggleShift(dateStr) {
    const entry = shiftMap[dateStr] || {};
    let newType = 'morning'; // El tipo inicial

    // Rotamos entre los turnos disponibles
    switch (entry.shift_type) {
      case 'morning':
        newType = 'evening';
        break;
      case 'evening':
        newType = 'night';
        break;
      case 'night':
        newType = 'morning_afternoon';
        break;
      case 'morning_afternoon':
        newType = 'morning_night';
        break;
      case 'morning_night':
        newType = 'afternoon_night';
        break;
      case 'afternoon_night':
        newType = 'reinforcement';
        break;
      case 'reinforcement':
        newType = 'morning';
        break;
      default:
        newType = 'morning'; // Si no tiene tipo, empieza en "morning"
    }

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

    // Guardar en Supabase (o cualquier base de datos que utilices)
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

  async function handleDeletePublication(shiftId, dateStr) {
    try {
      const token = await getToken();
      await removeShift(shiftId, token); // Esta sería tu función para "despublicar"
      await fetchCalendar(isWorker.worker_id, token);
      setSelectedDay(dateStr);
    } catch (error) {
      console.error('Error quitando publicación:', error.message);
    }
  }

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


    // Es un turno mio. Puedo editarlo, quitarlo o publicarlo. En caso de estar publicado puedo quitarlo.
    if (entry.isMyShift) {
      return (
        <div>
          <h3 className="font-bold mb-2">{dayLabel} - Tu turno</h3>
          <p>Tipo: {entry.shift_type}</p>
          {entry.isPublished ? (
            <>
              <p>Turno publicado</p>
              <Button
                label="Quitar publicación"
                variant="ghost"
                size="lg"
                onClick={() => handleDeletePublication(entry.shift_id)}
              />
            </>
          ) : (
            <>
              <Button
                label="Publicar turno"
                variant="primary"
                size="lg"
                leftIcon={<Lightning size={20} />}
                rightIcon={<Lightning size={20} />}
                onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
              />

              <Button
                label="Eliminar"
                variant="outline"
                size="md"
                onClick={() => handleRemoveShiftForDay(dateStr)}
              />
              <Button
                label="Editar"
                variant="outline"
                size="md"
                onClick={() => toggleShift(dateStr)}
              />

            </>
          )
          }
        </div >
      );
    }
    // Es una preferencia o disponibilidad
    if (entry.isPreference) {
      return (
        <div>
          <h3 className="font-bold mb-2">{dayLabel} - Disponibilidad</h3>
          <p>Tipo: {entry.preference_type}</p>
          <Button
            label="Editar"
            variant="outline"
            size="md"
            onClick={() => togglePreference(dateStr)}
          />
        </div>
      );
    }

    // Es un turno recibido. Sólo puedo publicarlo.
    if (entry.isReceived) {
      return (
        <div>
          <h3 className="font-bold mb-2">{dayLabel} - Turno Recibido</h3>
          <p>Tipo: {entry.shift_type}</p>
          <p>Propietario del turno: {entry.requester_name} {entry.requester_surname}</p>

          <Button
            label="Publicar turno"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} />}
            rightIcon={<Lightning size={20} />}
            onClick={() => navigate(`/shifts/create?date=${dateStr}&shift_type=${entry.shift_type}`)}
          />
        </div>
      );
    }

    // Es un día que tenía turno pero lo cambié. Ahora puedo añadir turno o disponibilidad.
    if (entry.isSwapped) {
      return (
        <div>
          <h3 className="font-bold mb-2">{dayLabel} - Turno Traspasado</h3>
          <div className='btn-group'>
            <Button
              label="Añadir turno"
              variant="primary"
              size="lg"
              leftIcon={<Lightning size={20} />}
              rightIcon={<Lightning size={20} />}
              onClick={() => toggleShift(dateStr)}
            />
            <Button
              label="Añadir disponibilidad"
              variant="secondary"
              size="lg"
              leftIcon={<Lightning size={20} />}
              rightIcon={<Lightning size={20} />}
              onClick={() => togglePreference(dateStr)}
            />
          </div>
        </div>
      );
    }

    // Si no hay nada
    return (
      <div>
        <h3 className="font-bold mb-2">{dayLabel} - Día libre</h3>
        <div className='btn-group'>
          <Button
            label="Añadir turno"
            variant="primary"
            size="lg"
            leftIcon={<Lightning size={20} />}
            rightIcon={<Lightning size={20} />}
            onClick={() => toggleShift(dateStr)}
          />
          <Button
            label="Añadir disponibilidad"
            variant="secondary"
            size="lg"
            leftIcon={<Lightning size={20} />}
            rightIcon={<Lightning size={20} />}
            onClick={() => togglePreference(dateStr)}
          />
        </div>
      </div>
    );
  }


  return (
    <div className="p-4">
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

      {isLoadingCalendar && (
        <div className="flex justify-center my-4">
          <div className="loader"></div> {/* O texto "Cargando turnos..." si quieres más simple */}
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
              morning: 'Mañanas',
              evening: 'Tardes',
              night: 'Noches',
              reinforcement: 'Refuerzos',
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
    </div>
  );
}

export default MonthlyCalendar;
