import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getSpecialities = async (token) => {
  const response = await axios.get(`${API_URL}/api/specialities`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};
