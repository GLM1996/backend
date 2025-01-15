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
    const pipeline = await cargarPipeline(deal.pipelineId)

    //&& (pipeline.name.includes('F/U') || pipeline.name.includes('UNDEFINED'))
    if (person.id === 39927) {
        //await createNoteForPerson(apiKey, person, deal)
        //await actualizarStagePerson(apiKey, person.id, stageId, stageName)
        console.log("Person ID: ", person.id, "Person Name:", person.firstName, person.lastName)
        console.log("Pipeline Name: ", pipeline.name, "Stage name", deal.stageName)
    } else {
        console.log("Person ID: ", person.id, "Person Name:", person.firstName, person.lastName)
        console.log("Pipeline Name: ", pipeline.name, "Stage name", deal.stageName)
    }
    //const pipeline = await cargarPipeline(deal.pipelineId)
    //const stages = pipeline.stages
    //const stage = stages.find(element => element.id === deal.stageId);

    //return { deal: deal, person: person, pipeline: pipeline,stage: stage}
    return { deal: deal, person: person }
};
async function obtenerDeal(dealUri) {
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    const options = {
        method: 'GET', headers: {
            'Authorization': 'Basic ' + btoa(API_KEY + ':')
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
async function actualizarStagePerson(apiKey, idPerson, stageId, stageName) {
    const url = `https://api.followupboss.com/v1/people/${idPerson}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(apiKey + ':') // Usamos 'Basic' y la clave API codificada en base64
        },
        body: JSON.stringify({
            stage: stageName, // Nuevo stage
            stageId: stageId
        })
    }
    /*try {
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            // await actualizarDeal(stageId, newStage)
            await createNoteForPerson(newStage);
            showToast('Stage changed', 0)
        } else {
            const errorData = await response.json();
            showToast(errorData, 1)
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con Follow Up Boss');
    }*/
    console.log('Logica de actualizar el Stage')
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

