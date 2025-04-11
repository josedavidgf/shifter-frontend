import axios from 'axios';

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
    return response.data.data;
  };

  export const removeShift = async (id, token) => {
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
  
  