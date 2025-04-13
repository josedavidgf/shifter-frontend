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
  
    export const getFullWorkerProfile = async (token) => {
        console.log('📤 Enviando token al backend para perfil completo:', token); // 👈
        const response = await axios.get(`${API_URL}/api/workers/me/full`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        console.log('📥 Datos del perfil completo del trabajador:', response.data);
        return response.data.data;
    };
  
    export const updateWorkerInfo = async (data, token) => {
        const response = await axios.put(`${API_URL}/api/workers/me`, data, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };
  
    export const updateWorkerHospital = async (data, token) => {
        const response = await axios.put(`${API_URL}/api/workers/me/hospital`, data, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };
  
    export const updateWorkerSpeciality = async (data, token) => {
        const response = await axios.put(`${API_URL}/api/workers/me/speciality`, data, {
        headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    };
  
    export async function getWorkerStats(token) {
        const response = await axios.get(`${API_URL}/api/workers/me/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      
        return response.data.data;
      }
      

      export async function getUserPreferences(token) {
        const response = await axios.get(`${API_URL}/api/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('📥 Datos de preferencias:', response.data);
        return response.data.data;
      }
      
      export async function updateUserPreferences(payload, token) {
        const response = await axios.put(`${API_URL}/api/preferences`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      }