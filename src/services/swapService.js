import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getReceivedSwaps = async (token) => {
    const response = await axios.get(`${API_URL}/api/swaps/received`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data; // 👈 accede al contenido dentro del payload de axios
}

