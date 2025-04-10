import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;




export const checkIfWorkerExists = async (token) => {
    const response = await axios.get(`${API_URL}/api/workers/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const worker = response.data.data;
    console.log('📥 Datos del trabajador:', worker);
    return !!worker; // devuelve true si existe
};


export const checkIfWorkerHasHospitalAndSpeciality = async (token) => {
    console.log('📤 Enviando token al backend para completion:', token); // 👈
    const response = await axios.get(`${API_URL}/api/workers/me/completion`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('📥 Datos de la respuesta completion:', response.data);
    const { hasHospital, hasSpeciality } = response.data.data;
    return hasHospital && hasSpeciality;
  };
  
  
  