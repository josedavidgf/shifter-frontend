// src/utils/getNextPreferenceType.js
export function getNextPreferenceType(currentType) {
    switch (currentType) {
      case 'morning':
        return 'evening';
      case 'evening':
        return 'night';
      case 'night':
        return 'morning';
      default:
        return 'morning';
    }
  }
  