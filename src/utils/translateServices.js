export function translateShiftType(type) {
    switch (type) {
      case 'morning':
        return 'mañana';
      case 'evening':
        return 'tarde';
      case 'night':
        return 'noche';
      case 'reinforcement':
        return 'refuerzo';
      default:
        return type;
    }
  }
  