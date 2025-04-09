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

export async function createWorker(data, token) {
    console.log('📤 Enviando token al backend:', token); // 👈
    try{
        console.log('📤 Datos a enviar:', data,token); // 👈
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear trabajador:', error.message?.data || error.message);
        throw error;
    }
}

export const createWorkerHospital = async (workerId, hospitalId, token) => {
const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers/hospitals`, {
    worker_id: workerId,
    hospital_id: hospitalId,
}, {
    headers: { Authorization: `Bearer ${token}` }
});

return response.data;
};

export const createWorkerSpeciality = async (workerId, specialityId, qualificationLevel, token) => {
const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers/specialities`, {
    worker_id: workerId,
    speciality_id: specialityId,
    qualification_level: qualificationLevel,
}, {
    headers: { Authorization: `Bearer ${token}` }
});

return response.data;
};
  