// src/api/useShiftApi.js
import { useState } from 'react';
import {
  createShift,
  getMyShifts,
  getMyShiftsPublished,
  getShiftById,
  updateShift,
  removeShift,
  getHospitalShifts,
  getShiftPreferencesByShiftId,
  updateShiftPreferences,
  expireOldShifts,
  getMyAvailableShifts,
} from '../services/shiftService';

export function useShiftApi() {
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
    createShift: (data, token) => apiCall(createShift, data, token),
    getMyShifts: (token) => apiCall(getMyShifts, token),
    getMyShiftsPublished: (token) => apiCall(getMyShiftsPublished, token),
    getShiftById: (id, token) => apiCall(getShiftById, id, token),
    updateShift: (id, updates, token) => apiCall(updateShift, id, updates, token),
    removeShift: (id, token) => apiCall(removeShift, id, token),
    getHospitalShifts: (token) => apiCall(getHospitalShifts, token),
    getShiftPreferencesByShiftId: (shiftId, token) => apiCall(getShiftPreferencesByShiftId, shiftId, token),
    updateShiftPreferences: (shiftId, preferences, token) => apiCall(updateShiftPreferences, shiftId, preferences, token),
    expireOldShifts: (token) => apiCall(expireOldShifts, token),
    getMyAvailableShifts: (workerId, token) => apiCall(getMyAvailableShifts, workerId, token),
    loading,
    error,
  };
}
