import supabase from '../config/supabase';

// Crear preferencia
export async function createSwapPreference(preferenceData) {
    const { data, error } = await supabase
        .from('swap_preferences')
        .insert([preferenceData])
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}

// Borrar preferencia
export async function deleteSwapPreference(preferenceId) {
    const { error } = await supabase
        .from('swap_preferences')
        .delete()
        .eq('preference_id', preferenceId);

    if (error) throw new Error(error.message);
}

// Obtener preferencias del usuario
export async function getMySwapPreferences(workerId) {
    const { data, error } = await supabase
        .from('swap_preferences')
        .select('*')
        .eq('worker_id', workerId)
        .order('date', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
}

// Actualizar preferencia existente
export async function updateSwapPreference(preferenceId, preferenceType) {
    const { data, error } = await supabase
      .from('swap_preferences')
      .update({ preference_type: preferenceType })
      .eq('preference_id', preferenceId)
      .select()
      .single();
  
    if (error) throw new Error(error.message);
    return data;
  }