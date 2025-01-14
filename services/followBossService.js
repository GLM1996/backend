import fetch from 'node-fetch';// O cualquier librería que estés usando para realizar las peticiones

// Función para obtener todos los pipelines
export const getPipelines = async (apiKey) => {
    let allPipelines = [];
    let url = `https://api.followupboss.com/v1/pipelines?limit=100`;

    try {
        while (url) {
            const response = await fetch(url, {
                headers: { 'Authorization': 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64') }
            });
            const data = await response.json();
            allPipelines = [...allPipelines, ...(data.pipelines || [])];
            url = data._metadata?.nextLink || null;
        }
        return allPipelines;
    } catch (error) {
        console.error('Error al obtener deals:', error);
        res.status(500).send('Error al obtener deals');
    }
};
// Función para obtener todos los pipelines
export const getGoogleEnlaces = async () => {
    const sheetId = process.env.SHEET_ID; // Definido en .env
    const range = 'Enlaces!A2:B';
    const apiKey = process.env.GOOGLE_API_KEY; // Definido en .env

    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
       return data.values
    } catch (error) {
        console.error('Error al obtener Google Sheets:', error);
        res.status(500).send('Error al obtener Google Sheets');
    }
};
//funcion para webhook
export const getWebhook = async (data) => { 
        return data
};
