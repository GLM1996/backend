import fetch from 'node-fetch';// O cualquier librería que estés usando para realizar las peticiones

import { obtenerDeal, obtenerPersonDelDeal, actualizarStagePerson } from './dealsService.js';

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
//funcion para actualizar la persona cuando se cambia deal
export const peopleUpdated = async (apiKey, data) => {
    const deal = await obtenerDeal(data)
    const person = await obtenerPersonDelDeal(deal.people[0].id)

    
   /* if (person.id === 39927) {
        //await createNoteForPerson(apiKey, person, deal)
        if (deal.pipelineName.includes('F/U') || deal.pipelineName.includes('UNDEFINED')) {
            //await actualizarStagePerson(apiKey, deal, person)
            console.log("P-ID: ", person.id, "P-N:", person.firstName, person.lastName, "P-S: ", person.stage, "D-S: ", deal.stageName, "MOD")
        } else {
            console.log("P-ID: ", person.id, "P-N:", person.firstName, person.lastName, "P-S: ", person.stage, "D-S: ", deal.stageName, "NO MOD")
        }
    } else {
        if (deal.pipelineName.includes('F/U') || deal.pipelineName.includes('UNDEFINED')) {
            //await actualizarStagePerson(apiKey, deal, person)
            console.log("-----Datos Deal Editado")
            console.log("P-ID: ", person.id)
            console.log("P-N:", person.name)
            console.log("D-ID: ", deal.id)
            console.log("D-N", deal.name)
            console.log("D-S: ", deal.stageName)
            //agent.name ? console.log("A: ", agent.name, "--> MOD") : console.log("A: ", "No Tiene", "--> MOD")
        } else {

            //console.log("A: ", agent.name, "--> NO MOD")
        }

    }*/
    console.log("-----Datos Deal Editado")
    console.log("P-ID: ", person.id)
    console.log("P-N:", person.name)
    console.log("D-ID: ", deal.id)
    console.log("D-N", deal.name)
    console.log("D-S: ", deal.stageName)

    //return { deal: deal, person: person }
};
//funcion para actualizar el deal cuando se cambia la persona
export const dealUpdated = async (apiKey, data) => {
    const person = await obtenerPerson(data)

    return { deal: deal, person: person }
};


