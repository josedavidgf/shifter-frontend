import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const validateAccessCode = async (code) => {
  const response = await axios.post(`${API_URL}/api/access-codes/validate`, { code });
  return response.data.data;
};
