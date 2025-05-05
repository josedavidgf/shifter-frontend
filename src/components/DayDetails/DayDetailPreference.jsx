// src/components/DayDetails/DayDetailPreference.jsx
import React from 'react';
import Button from '../ui/Button/Button';
import Chip from '../ui/Chip/Chip'; // Ajusta path si es necesario
import { shiftTypeLabels, shiftTypeIcons } from '../../utils/labelMaps'; // asegúrate de tener estos
import { parseISO, format, isToday } from 'date-fns';
import es from 'date-fns/locale/es';
import { Trash } from '../../theme/icons';

const ALL_TYPES = ['morning', 'evening', 'night', 'reinforcement'];

export default function DayDetailPreference({
  dateStr,
  entry,
  dayLabel,
  onEditPreference, // ahora se usará como togglePreference(dateStr, type)
  onDeletePreference, // opcional: eliminar todas
  loadingDeletePreference,
}) {
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const parsedDate = parseISO(dateStr);
  const isTodayDate = isToday(parsedDate);
  const displayDay = isTodayDate ? 'Hoy' : capitalize(format(parsedDate, 'EEEE', { locale: es }));
  const dateLabel = `${displayDay}, ${format(parsedDate, 'dd/MM')} - Día libre`;

  const activeTypes = entry.preference_types || [];

  return (
    <div style={{ borderRadius: '12px', backgroundColor: 'rgba(245, 246, 248, 0.6)' }}>
      <div style={{ padding: '16px' }}>
        <h3 className="font-bold mb-2">{dateLabel}</h3>
        <p className="mb-4">
          {isTodayDate
            ? <>Hoy no tienes turno. <strong>Disponibilidad marcada para:</strong></>
            : <>El {dayLabel.toLowerCase()} no tienes turno. <strong>Disponibilidad marcada para:</strong></>}
        </p>

        
        <div className="chip-scroll-group mb-3">
          {ALL_TYPES.map((type) => {
            const isActive = activeTypes.includes(type);
            const Icon = shiftTypeIcons?.[type];

            return (
              <Chip
                key={type}
                label={shiftTypeLabels[type]}
                icon={Icon}
                selected={isActive}
                onClick={() => onEditPreference(dateStr, type)}
                disabled={loadingDeletePreference}
              />
            );
          })}
        </div>


        {activeTypes.length > 0 && (
          <Button
            label="Eliminar disponibilidades"
            variant="outline"
            size="lg"
            leftIcon={<Trash size={20} />}
            onClick={() => onDeletePreference(dateStr)} // Borra todas
            isLoading={loadingDeletePreference}
            disabled={loadingDeletePreference}
          />
        )}
      </div>
    </div>
  );
}
