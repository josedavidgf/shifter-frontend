import axios from 'axios';
import { getShiftsForMonth } from './calendarService';
import { getAcceptedSwaps } from './swapService';

const API_URL = process.env.REACT_APP_BACKEND_URL;


export const createShift = async (data, token) => {
  const response = await axios.post(`${API_URL}/api/shifts`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMyShifts = async (token) => {
  const response = await axios.get(`${API_URL}/api/shifts/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('📥 Datos de los turnos:', response.data.data);
  return response.data.data;
};

export const getMyShiftsPublished = async (token) => {
  console.log('AQUI');
  console.log('AQUI Token;', token);
  const response = await axios.get(`${API_URL}/api/shifts/mine-published`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('📥 Datos de los turnos:', response.data.data);
  return response.data.data;
};

export const getShiftById = async (id, token) => {
  const response = await axios.get(`${API_URL}/api/shifts/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const updateShift = async (id, updates, token) => {
  const response = await axios.patch(`${API_URL}/api/shifts/${id}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('📤 Datos del turno actualizado:', response.data.data);
  return response.data.data;
};

export const removeShift = async (id, token) => {
  console.log('shift publicado:', id);
  const response = await axios.patch(`${API_URL}/api/shifts/${id}/remove`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};

export const getHospitalShifts = async (token) => {
  const response = await axios.get(`${API_URL}/api/shifts/hospital`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}
// Obtener las preferencias de un turno
export async function getShiftPreferencesByShiftId(shiftId, token) {
  const response = await fetch(`${API_URL}/api/shifts/${shiftId}/preferences`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Error al cargar preferencias');
  return result.data;
}

// Actualizar preferencias de un turno
export async function updateShiftPreferences(shiftId, preferences, token) {
  const response = await fetch(`${API_URL}/api/shifts/${shiftId}/preferences`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferences }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Error al actualizar preferencias');
  return result.data;
}

export async function expireOldShifts(token) {
  try {
    const response = await axios.patch(`${API_URL}/api/shifts/expire-old`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (err) {
    console.error('❌ Error al expirar turnos:', err.message);
    throw err;
  }
}

export async function getMyAvailableShifts(workerId, token) {
  console.log('workerId getMyAvailableShifts ',workerId)
  const [myShifts, acceptedSwaps] = await Promise.all([
    getShiftsForMonth(workerId), // Esto ya usa worker_id internamente
    getAcceptedSwaps(token)
  ]);

  const now = new Date();

  // Mapeamos turnos propios
  const ownShifts = (myShifts || [])
    .filter(shift => new Date(shift.date) >= now)
    .map(shift => ({
      id: `${shift.date}_${shift.shift_type}`,
      date: shift.date,
      type: shift.shift_type,
      label: shift.shift_label,
    }));
  console.log('ownShifts',ownShifts);

  const receivedShifts = (acceptedSwaps || [])
    .filter(swap => swap.offered_date && new Date(swap.offered_date) >= now)
    .map(swap => ({
      id: `${swap.offered_date}_${swap.offered_type}`,
      date: swap.offered_date,
      type: swap.offered_type,
      label: swap.offered_label,
      indicator: 'received',
    }));
    console.log('receivedShifts',receivedShifts);

  return [...ownShifts, ...receivedShifts];
}