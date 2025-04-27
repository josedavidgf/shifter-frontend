// src/api/useSpecialityApi.js
import { useState } from 'react';
import { getSpecialitiesByHospital, addSpecialityToWorker } from '../services/specialityService';

export function useSpecialityApi() {
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
    getSpecialitiesByHospital: (hospitalId, token) => apiCall(getSpecialitiesByHospital, hospitalId, token),
    addSpecialityToWorker: (workerId, specialityId, token) => apiCall(addSpecialityToWorker, workerId, specialityId, token),
    loading,
    error,
  };
}
