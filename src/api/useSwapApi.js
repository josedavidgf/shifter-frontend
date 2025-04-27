// src/api/useSwapApi.js
import { useState } from 'react';
import {
  getReceivedSwaps,
  cancelSwap,
  respondToSwap,
  proposeSwap,
  getSentSwaps,
  getAcceptedSwaps,
  getSwapById,
  getSwapsByShiftId,
  getSwapNotifications,
} from '../services/swapService';

export function useSwapApi() {
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
    getReceivedSwaps: (token) => apiCall(getReceivedSwaps, token),
    cancelSwap: (swapId, token) => apiCall(cancelSwap, swapId, token),
    respondToSwap: (swapId, status, token) => apiCall(respondToSwap, swapId, status, token),
    proposeSwap: (shiftId, data, token) => apiCall(proposeSwap, shiftId, data, token),
    getSentSwaps: (token) => apiCall(getSentSwaps, token),
    getAcceptedSwaps: (token) => apiCall(getAcceptedSwaps, token),
    getSwapById: (swapId, token) => apiCall(getSwapById, swapId, token),
    getSwapsByShiftId: (shiftId, token) => apiCall(getSwapsByShiftId, shiftId, token),
    getSwapNotifications: (token, workerId, myShiftIds) => apiCall(getSwapNotifications, token, workerId, myShiftIds),
    loading,
    error,
  };
}
