// src/api/useWorkerApi.js
import { useState } from 'react';
import {
  getWorkerTypes,
  createWorker,
  getMyWorkerProfile,
  createWorkerHospital,
  createWorkerSpeciality,
  completeOnboarding,
} from '../services/workerService';

export function useWorkerApi() {
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
    getWorkerTypes: (token) => apiCall(getWorkerTypes, token),
    createWorker: (data, token) => apiCall(createWorker, data, token),
    getMyWorkerProfile: (token) => apiCall(getMyWorkerProfile, token),
    createWorkerHospital: (workerId, hospitalId, token) => apiCall(createWorkerHospital, workerId, hospitalId, token),
    createWorkerSpeciality: (workerId, specialityId, qualificationLevel, token) => apiCall(createWorkerSpeciality, workerId, specialityId, qualificationLevel, token),
    completeOnboarding: (token) => apiCall(completeOnboarding, token),
    loading,
    error,
  };
}
