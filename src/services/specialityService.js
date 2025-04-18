import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getSpecialities = async (token) => {
  const response = await axios.get(`${API_URL}/api/specialities`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const addSpecialityToWorker = async (workerId, specialityId,token) => {
  console.log('📤 Enviando token al backend para especialidades:', token); // 👈
  console.log('📤 Datos a enviar:', { workerId, specialityId }, token); // 👈
  const response = await axios.post(`${API_URL}/api/workers/specialities`, {
    workerId,
    specialityId,
    qualificationLevel: 'resident', // o el nivel que decidas
    experienceYears: 1,
  }, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export async function getSpecialitiesByHospital(hospitalId, token) {
  console.log('📤 Enviando token al backend para especialidades por hospital:', token); // 👈
  console.log('📤 Datos a enviar:', hospitalId, token); // 👈
  const response = await axios.get(`${API_URL}/api/specialities/by-hospital/${hospitalId}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  console.log('📥 Datos de la respuesta de especialidades de este hospital:', response.data);
  return response.data.data; // Ajusta si tu respuesta cambia
}