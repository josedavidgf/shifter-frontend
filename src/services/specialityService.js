import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getSpecialities = async (token) => {
  const response = await axios.get(`${API_URL}/api/specialities`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};

export const addSpecialityToWorker = async (workerId, specialityId,token) => {
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
  const response = await axios.get(`${API_URL}/api/specialities/by-hospital/${hospitalId}`, {
    headers: {Authorization: `Bearer ${token}`}
  });
  return response.data.data; // Ajusta si tu respuesta cambia
}