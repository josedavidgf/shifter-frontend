// src/hooks/useAvailableShifts.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyAvailableShifts } from '../services/shiftService';

const useAvailableShifts = () => {
  const { isWorker, getToken } = useAuth();
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isWorker) return;
    console.log('isworker:',isWorker);
    const fetchShifts = async () => {
      try {
        const workerId = isWorker.worker_id;
        console.log ('workerId',workerId);
        const token = await getToken();
        console.log('token', token);
        const availableShifts = await getMyAvailableShifts(workerId, token);
        console.log('availableShifts',availableShifts);
        availableShifts.sort((a, b) => new Date(a.date) - new Date(b.date));

        setShifts(availableShifts); // ✅ ya vienen filtrados
      } catch (err) {
        console.error('Error fetching available shifts:', err.message);
        setError('No se pudieron cargar los turnos disponibles.');
      } finally {
        setLoading(false);
      }
    };

    fetchShifts();
  }, [getToken,isWorker]);

  return { shifts, loading, error };
};

export default useAvailableShifts;
