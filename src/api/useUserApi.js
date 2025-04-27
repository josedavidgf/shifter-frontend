// src/api/useUserApi.js
import { useState } from 'react';
import { getFullWorkerProfile, updateWorkerInfo } from '../services/userService'; // ✅ Importar ambas funciones

export function useUserApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiFunction, ...params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...params);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getFullWorkerProfile: (token) => callApi(getFullWorkerProfile, token), // ✅ Añadido
    updateWorkerInfo: (data, token) => callApi(updateWorkerInfo, data, token),
    loading,
    error,
  };
}
