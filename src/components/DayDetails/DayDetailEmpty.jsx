// src/components/DayDetails/DayDetailEmpty.jsx
import React from 'react';
import Button from '../../components/ui/Button/Button';
import { CalendarPlus, Lightbulb } from '../../theme/icons';
import { trackEvent } from '../../hooks/useTrackPageView'; // Importamos la función de tracking
import { EVENTS } from '../../utils/amplitudeEvents'; // Importamos los eventos

export default function DayDetailEmpty({
  dateStr,
  dayLabel,
  onAddShift,
  onAddPreference,
}) {
  return (
    <div style={{ borderRadius: '12px', backgroundColor: 'rgba(245, 246, 248, 0.8)' }}>
      <div style={{ padding: '16px' }}>
        <h3 className="font-bold mb-2">{dayLabel} - Día libre</h3>
        <p className="mb-4">Hoy no tienes turno ni lo tienes seleccionado como disponible para trabajar.</p>

        <div className="btn-group">
          <Button
            label="Añadir turno"
            variant="primary"
            size="lg"
            leftIcon={<CalendarPlus size={20} />}
            onClick={() => {
              trackEvent(EVENTS.ADD_SINGLE_SHIFT_BUTTON_CLICKED, { day: dateStr });
              onAddShift(dateStr);
            }}
          />

          <Button
            label="Añadir disponibilidad"
            variant="secondary"
            size="lg"
            leftIcon={<Lightbulb size={20} />}
            onClick={() => {
              trackEvent(EVENTS.ADD_SINGLE_AVAILABILITY_BUTTON_CLICKED, { day: dateStr });
              onAddPreference(dateStr);
            }}
          />
        </div>
      </div>
    </div>
  );
}
