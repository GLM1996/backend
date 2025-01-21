
import supabase from './conexion.js';

/*export const guardarDatosWebhook = async (data) => {
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
};*/
export const guardarDatosWebhook = async (data) => {
    const { person_id, person_name, deal_id, deal_name, deal_stage } = data;

    const { error } = await supabase
        .from('webhook_data') // Nombre de la tabla
        .upsert(
            [
                {
                    person_id,
                    person_name,
                    deal_id,
                    deal_name,
                    deal_stage,
                    created_at: new Date().toISOString(), // Actualiza la fecha
                },
            ],
            { onConflict: ['person_id', 'deal_id'] } // Claves únicas para determinar conflicto
        );

    if (error) {
        console.error('Error al guardar datos en Supabase:', error);
        throw error;
    }

    console.log('Datos guardados o actualizados correctamente en Supabase');
};

export const obtenerTodosLosDatos = async (req, res) => {
    console.log('buscando')
    try {
        const { data, error } = await supabase
            .from('webhook_data') // Nombre de la tabla
            .select('*'); // Seleccionar todas las columnas

        if (error) {
            throw error; // Manejar errores de la consulta
        }

        if (data) {
            // Enviar los datos como respuesta JSON
            res.status(200).json(data);
        }
    } catch (error) {
        console.error('Error al consultar los datos:', error);
        res.status(500).json({ error: 'Error al consultar los datos' }); // Responder con un error HTTP 500
    }

};

