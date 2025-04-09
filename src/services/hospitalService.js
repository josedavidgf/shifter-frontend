import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getHospitals = async (token) => {
  const response = await axios.get(`${API_URL}/api/hospitals`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data;
};
