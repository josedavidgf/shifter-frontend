import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;


// Obtener el token del almacenamiento local
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté guardado al iniciar sesión
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function getWorkerTypes() {
    try {
        const response = await axios.get(`${API_URL}/api/workerTypes`, {
            headers: getAuthHeader()
        });
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener tipos de trabajador:', error.message);
        return [];
    }
}

export async function createWorker(data, token) {
    try{
        const response = await axios.post(`${API_URL}/api/workers`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyWorkerProfile = async (token) => {
    const response = await axios.get(`${API_URL}/api/workers/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  };

export const createWorkerHospital = async (workerId, hospitalId, token) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers/hospitals`, {
            workerId,
            hospitalId,
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la relación del trabajador con el hospital:', error.message?.data || error.message);
        throw error;
    }


};

export const createWorkerSpeciality = async (workerId, specialityId, qualificationLevel, token) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/workers/specialities`, {
        workerId,
        specialityId,
        qualificationLevel,
        experienceYears: 1,
        }, {
        headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al crear la relación del trabajador con la especialidad:', error.message?.data || error.message);
        throw error;
    }
};

export async function completeOnboarding(token) {
    await axios.patch(`${API_URL}/api/workers/complete-onboarding`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
  