// src/api/useSwapPreferencesApi.js
import { useState } from 'react';
import { getMySwapPreferences, createSwapPreference, deleteSwapPreference, updateSwapPreference } from '../services/swapPreferencesService';

export function useSwapPreferencesApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = async (apiFunction, ...params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFunction(...params);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getMySwapPreferences: (workerId) => apiCall(getMySwapPreferences, workerId),
    createSwapPreference: (preferenceData) => apiCall(createSwapPreference, preferenceData),
    deleteSwapPreference: (preferenceId) => apiCall(deleteSwapPreference, preferenceId),
    updateSwapPreference: (preferenceId, preferenceType) => apiCall(updateSwapPreference, preferenceId, preferenceType),
    loading,
    error,
  };
}
