// src/services/supportService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const sendSupportContact = async (workerId, title, description, token) => {

  try {
    const response = await axios.post(
      `${API_URL}/api/support/contact`,
      { workerId, title, description },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('❌ Error en sendSupportContact:', error.message);
    throw new Error('Error al enviar el mensaje de soporte');
  }
};
