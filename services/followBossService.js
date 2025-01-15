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
export const getWebhook = async (apiKey, data) => {
    const deal = await obtenerDeal(data)
    const person = await cargarPerson(deal.people[0].id)
    //const pipeline = await cargarPipeline(deal.pipelineId)

    //&& (pipeline.name.includes('F/U') || pipeline.name.includes('UNDEFINED'))
    if (person.id === 39927) {
        //await createNoteForPerson(apiKey, person, deal)
        if (deal.pipelineName.includes('F/U') || deal.pipelineName.includes('UNDEFINED')) {
            await actualizarStagePerson(apiKey, deal, person)
            console.log("Person ID: ", person.id, "Person Name:", person.firstName, person.lastName, "Person StageOld: ", person.stage, "Person Stage New: ", deal.stageName)
        } else {
            console.log("Person ID: ", person.id, "Person Name:", person.firstName, person.lastName, "Person StageOld: ", person.stage, "Person Stage New: ", "No se Actualiza")
        }
    } else {
        if(deal.pipelineName.includes('F/U') || deal.pipelineName.includes('UNDEFINED')){
            console.log("Person ID: ", person.id, "Person Name:", person.name, "Deal ID: ", deal.id, ' - ', deal.name, "Person Stage: ", deal.stageName, "MODIFICA")
        }else{
            console.log("Person ID: ", person.id, "Person Name:", person.name, "Deal ID: ", deal.id, ' - ', deal.name, "Person Stage: ", deal.stageName, "NO MODIFICA")
        }
        
    }
    return { deal: deal, person: person }
};
async function obtenerDeal(dealUri) {
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    const options = {
        method: 'GET', headers: {
            'Authorization': 'Basic ' + btoa(API_KEY + ':'),
            'X-System': 'Automatizaciones',
            'X-System-Key': '6560b17c4117adb12bbff065f0600788'
        }
    }
    const response = await fetch(dealUri, options);
    const data = await response.json();
    return data
}
async function cargarPerson(personId) {
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    let url = `https://api.followupboss.com/v1/people/${personId}`;
    const options = {
        method: 'GET', headers: {
            'X-System': 'Automatizaciones',
            'X-System-Key': '6560b17c4117adb12bbff065f0600788',
            'Authorization': 'Basic ' + btoa(API_KEY + ':') // Usamos 'Basic' y la clave API codificada en base64
        }
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data
}
async function createNoteForPerson(apiKey, person, deal) {
    try {
        // Crear la nota
        const response = await fetch('https://api.followupboss.com/v1/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(apiKey + ':')}` // Autenticación básica con API Key
            },
            body: JSON.stringify({
                personId: person.id, // ID del contacto
                subject: 'DEAL UPDATED', // Texto de la nota
                body: `<b style="color: red">Deal actualizado de ${person.dealStage}</b> to <b style="color: green">${deal.pipelineName} - ${deal.stageName}</b>`,
                isHtml: true
            })
        });

        if (!response.ok) {
            console.log(`Error al crear la nota: ${response.statusText}`);
        }
        const result = await response.json();
        console.log('Logica de crear nota:', result);
    } catch (error) {
        console.error('Error al crear la nota:', error);
        alert('Hubo un error al crear la nota.');
    }
}
async function actualizarStagePerson(apiKey, deal, person) {
    const url = `https://api.followupboss.com/v1/people/${person.id}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-System': 'Automatizaciones',
            'X-System-Key': '6560b17c4117adb12bbff065f0600788',
            'Authorization': 'Basic ' + btoa(apiKey + ':') // Usamos 'Basic' y la clave API codificada en base64
        },
        body: JSON.stringify({
            stage: deal.stageName, // Nuevo stage
        })
    }
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            // await actualizarDeal(stageId, newStage)
            // await createNoteForPerson(newStage);
        } else {
            const errorData = await response.json();
            showToast(errorData, 1)
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con Follow Up Boss');
    }

}
async function cargarPipeline(pipelineId) {
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    const url = `https://api.followupboss.com/v1/pipelines/${pipelineId}`
    const options = {
        method: 'GET', headers: {
            'Authorization': 'Basic ' + btoa(API_KEY + ':')
        }
    }
    const response = await fetch(url, options);
    const data = await response.json();
    return data
}

