
import supabase from './conexion.js'; 

export const guardarDatosWebhook = async (data) => {
    const { person_id, person_name, deal_id, deal_name, deal_stage } = data;

    const { error } = await supabase
        .from('webhook_data') // Nombre de la tabla
        .insert([
            {
                person_id,
                person_name,
                deal_id,
                deal_name,
                deal_stage,
            },
        ]);

    if (error) {
        console.error('Error al insertar datos en Supabase:', error);
        throw error;
    }

    console.log('Datos guardados correctamente en Supabase');
};
export const obtenerTodosLosDatos = async () => {
    try {
        const { data, error } = await supabase
            .from('webhook_data') // Nombre de la tabla
            .select('*'); // Seleccionar todas las columnas

        if (error) {
            throw error; // Manejar errores de la consulta
        }

        return data; // Devuelve los datos obtenidos
    } catch (error) {
        console.error('Error al consultar los datos:', error);
        throw error;
    }
};

