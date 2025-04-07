import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Registro de usuario
export async function registerUser(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/register`, { email, password });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Error al registrar');
    }
}

// Inicio de sesión
export async function loginUser(email, password) {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Error al iniciar sesión');
    }
}

// Obtener perfil de usuario
export async function getUserProfile() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || 'Error al obtener el perfil');
    }
}
