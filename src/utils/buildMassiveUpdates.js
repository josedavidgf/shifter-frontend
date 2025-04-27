// src/utils/buildMassiveUpdates.js
import { setShiftForDay, removeShiftForDay } from '../services/calendarService';

export function buildMassiveUpdates(draftShiftMap, shiftMap, workerId) {
  const updates = [];

  for (const [date, draftEntry] of Object.entries(draftShiftMap)) {
    const originalEntry = shiftMap[date] || {};

    const changed = JSON.stringify(draftEntry) !== JSON.stringify(originalEntry);

    if (changed) {
      if (draftEntry.isMyShift && draftEntry.shift_type) {
        updates.push(setShiftForDay(workerId, date, draftEntry.shift_type));
      } else if (!draftEntry.isMyShift && originalEntry.isMyShift) {
        updates.push(removeShiftForDay(workerId, date));
      }
    }
  }

  return updates;
}
