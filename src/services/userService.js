import supabase from '../config/supabase';

export const checkIfWorkerExists = async (userId) => {
    console.log('🔍 Verificando si el trabajador existe con userId:', userId);

    const { data, error } = await supabase
        .from('workers')
        .select('worker_id')
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('Error al verificar si el trabajador existe:', error.message);
        // No existe o hubo error
        return false;
    }

    console.log('✅ Trabajador encontrado:', data);

    return !!data;
};
