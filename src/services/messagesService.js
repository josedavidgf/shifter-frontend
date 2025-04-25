import supabase from '../config/supabase';

export const getMessagesBySwap = async (swapId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('swap_id', swapId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

export const sendMessage = async ({ swap_id, sender_id, recipient_id, content }) => {
  const { error } = await supabase.from('messages').insert([
    { swap_id, sender_id, recipient_id, content },
  ]);
  if (error) throw new Error(error.message);
};

