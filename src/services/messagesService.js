// src/services/messagesService.js
import supabase from '../config/supabase';

// Obtener mensajes de un swap
export const getMessagesBySwap = async (swapId) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('swap_id', swapId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message || 'Error al cargar mensajes');
    }

    return data;
  } catch (err) {
    console.error('❌ Error en getMessagesBySwap:', err.message);
    throw err;
  }
};

// Enviar un mensaje en un swap
export const sendMessage = async ({ swap_id, sender_id, recipient_id, content }) => {
  try {
    if (!content || !content.trim()) {
      throw new Error('Mensaje vacío');
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ swap_id, sender_id, recipient_id, content }]);

    if (error) {
      throw new Error(error.message || 'Error al enviar mensaje');
    }
  } catch (err) {
    console.error('❌ Error en sendMessage:', err.message);
    throw err;
  }
};

export const getUnreadMessagesPerChat = async (workerId) => {
  const { data, error } = await supabase
    .rpc('get_unread_messages_per_chat', { worker_id_param: workerId });
  if (error) throw new Error(error.message);
  return data;
};

export const markMessagesAsRead = async (swapId, workerId) => {
  const { data, error } = await supabase
    .rpc('mark_messages_as_read', {
      swap_id_param: swapId,
      worker_id_param: workerId,
    });
  if (error) throw new Error(error.message);
  return data;
};
