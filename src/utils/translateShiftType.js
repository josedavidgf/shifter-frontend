
export function translateShiftType(shiftType) {
    switch (shiftType) {
      case 'morning': return 'Mañana';
      case 'evening': return 'Tarde';
      case 'night': return 'Noche';
      case 'morning_afternoon': return 'Mañana y tarde';
      case 'morning_night': return 'Mañana y noche';
      case 'afternoon_night': return 'Tarde y noche';
      case 'reinforcement': return 'Refuerzo';
      default: return shiftType;
    }
  }
  