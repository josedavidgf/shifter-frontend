import axios from 'axios';
import supabase from '../config/supabase';


const API_URL = process.env.REACT_APP_BACKEND_URL;

export const getReceivedSwaps = async (token) => {
    const response = await axios.get(`${API_URL}/api/swaps/received`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    console.log('📥 Datos de los swaps recibidos:', response.data.data);
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

  export async function getAcceptedSwaps(token) {
    const response = await axios.get(`${API_URL}/api/swaps/accepted`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data.data;
  }
  
  // GET /api/swaps/:id
export async function getSwapById(swapId, token) {
  console.log('🔍🔍🔍🔍 ID del swap para swap detail:', swapId);
  console.log('🔑🔑🔑🔑 Token de autenticación:', token);
  const response = await axios.get(`${API_URL}/api/swaps/${swapId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('⚠️⚠️⚠️ Datos del swap:', response.data.data);
  return response.data.data;
}

export async function getSwapsByShiftId(shiftId, token) {
  const response = await axios.get(`${API_URL}/api/swaps/by-shift/${shiftId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
}

export async function getSwapNotifications(token, workerId, myShiftIds) {
  // 🛡 Protección básica
  if (!workerId || !Array.isArray(myShiftIds) || myShiftIds.length === 0) {
    return { incomingCount: 0, updatesCount: 0 };
  }

  // 1. Propuestas que tengo que revisar
  const { data: incoming } = await supabase
    .from('swaps')
    .select('swap_id')
    .eq('status', 'proposed')
    .in('shift_id', myShiftIds)
    .throwOnError();

  // 2. Respuestas que me han dado
  const { data: updates } = await supabase
    .from('swaps')
    .select('swap_id, status')
    .eq('requester_id', workerId)
    .in('status', ['accepted', 'rejected'])
    .throwOnError();

  return {
    incomingCount: incoming?.length || 0,
    updatesCount: updates?.length || 0,
  };
}

