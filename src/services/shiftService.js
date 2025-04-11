import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;


export const createShift = async (data, token) => {
    const response = await axios.post(`${API_URL}/api/shifts`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };