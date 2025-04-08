import axios from 'axios';


// Obtener el token del almacenamiento local
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté guardado al iniciar sesión
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getWorkerTypes() {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/workerTypes`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener tipos de trabajador:', error.message);
        return [];
    }
}

export async function createWorker(workerData) {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers`, workerData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('❌ Error al crear el trabajador:', error.response?.data || error.message);
        throw error;
    }
}