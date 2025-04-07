import axios from 'axios';

const API_URL = 'http://localhost:4000/api/auth';

// Registro
export const register = async (email, password) => {
  const response = await axios.post(`${API_URL}/register`, { email, password });
  return response.data;
};

// Inicio de sesión
export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  localStorage.setItem('token', response.data.data.session.access_token);
  return response.data;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
};

// Obtener el token del usuario actual
export const getToken = () => {
  return localStorage.getItem('token');
};
