// src/api/useAvailableShifts.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useShiftApi } from '../api/useShiftApi'; // ✅ Hook limpio

const useAvailableShifts = () => {
  const { isWorker, getToken } = useAuth();
  const { getMyAvailableShifts, loading, error } = useShiftApi(); // 🆕
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (!isWorker) return;
    async function fetchAvailableShifts() {
      try {
        const token = await getToken();
        const workerId = isWorker.worker_id;
        const availableShifts = await getMyAvailableShifts(workerId, token);
        if (availableShifts) {
          availableShifts.sort((a, b) => new Date(a.date) - new Date(b.date));
          setShifts(availableShifts);
        }
      } catch (err) {
        console.error('❌ Error fetching available shifts:', err.message);
      }
    }

    fetchAvailableShifts();
  }, [getToken, isWorker]); // ✅ Solo dependencias estables

  return { shifts, loading, error };
};

export default useAvailableShifts;
