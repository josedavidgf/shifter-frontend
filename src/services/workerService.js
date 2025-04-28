// src/services/workerService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Utilidad para capturar errores
const handleError = (error, defaultMessage = 'Error en la operación') => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

const authHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Obtener tipos de trabajador
export const getWorkerTypes = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/workerTypes`, authHeaders(token));
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al obtener tipos de trabajador'));
  }
};

// Crear un nuevo worker
export const createWorker = async (data, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers`, data, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al crear trabajador'));
  }
};

// Obtener mi perfil de worker
export const getMyWorkerProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/workers/me`, authHeaders(token));
    console.log('Worker profile:', response.data.data);
    return response.data.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al cargar perfil de trabajador'));
  }
};

// Crear relación Worker-Hospital
export const createWorkerHospital = async (workerId, hospitalId, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers/hospitals`, {
      workerId,
      hospitalId,
    }, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al vincular trabajador con hospital'));
  }
};

// Crear relación Worker-Especialidad
export const createWorkerSpeciality = async (workerId, specialityId, qualificationLevel, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/workers/specialities`, {
      workerId,
      specialityId,
      qualificationLevel,
      experienceYears: 1,
    }, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al vincular trabajador con especialidad'));
  }
};

// Completar onboarding del worker
export const completeOnboarding = async (token) => {
  try {
    const response = await axios.patch(`${API_URL}/api/workers/complete-onboarding`, {}, authHeaders(token));
    return response.data;
  } catch (error) {
    throw new Error(handleError(error, 'Error al completar onboarding'));
  }
};
