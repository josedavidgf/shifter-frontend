export default function useUserInitials(user) {
    if (!user) return '?';
  
    const name = user?.name?.[0]?.toUpperCase() || '';
    const surname = user?.surname?.[0]?.toUpperCase() || '';
  
    const initials = `${name}${surname}`;
    return initials || '?';
  }
  