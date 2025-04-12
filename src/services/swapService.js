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

// PATCH /api/swaps/:id/cancel
export async function cancelSwap(swapId, token) {
    const response = await axios.patch(`${API_URL}/api/swaps/${swapId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data.data;
  }
  
  // PATCH /api/swaps/:id/respond
  export async function respondToSwap(swapId, status, token) {
    const response = await axios.patch(`${API_URL}/api/swaps/${swapId}/respond`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data.data;
  }
  
  
  export async function proposeSwap(shiftId, data, token) {
    const response = await axios.post(`${API_URL}/api/swaps`, {
      shift_id: shiftId,
      ...data
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data.data;
  }
  

  export async function getSentSwaps(token) {
    const response = await axios.get(`${API_URL}/api/swaps/sent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data.data;
  }
  