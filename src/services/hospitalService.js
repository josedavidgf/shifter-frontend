// src/services/hospitalService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getHospitals = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/hospitals`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.data;
  } catch (error) {
    console.error('❌ Error en getHospitals:', error.message);
    throw new Error('Error al cargar hospitales');
  }
};
