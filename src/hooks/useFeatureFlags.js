import { useAuth } from '../context/AuthContext';

export function useFeatureFlags() {
  const { featureFlags } = useAuth();

  const isEnabled = (flagName) => {
    if (!featureFlags) return false;
    return !!featureFlags[flagName];
  };

  return {
    isEnabled,
    flags: featureFlags,
  };
}
