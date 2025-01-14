import { getPipelines } from '../services/followBossService.js';
import { getGoogleEnlaces } from '../services/followBossService.js';
import { getWebhook } from '../services/followBossService.js'

export const getFollowBossPipelines = async (req, res) => {
    const apiKey = process.env.FOLLOW_BOSS_API_KEY;
    try {
        const pipelines = await getPipelines(apiKey);
        res.json(pipelines);
    } catch (error) {
        console.error('Error al obtener pipelines:', error);
        res.status(500).send('Error al obtener pipelines');
    }
};

export const getGoogleSheet = async (req, res) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    try {
        const enlaces = await getGoogleEnlaces();
        res.json(enlaces);
    } catch (error) {
        console.error('Error al obtener google sheet:', error);
        res.status(500).send('Error al obtener google sheet');
    }
};
export const getWebhooks = async (req, res) => {
    const webhookData = req.headers;
    console.log('----- Webhook recibido -----');

    //obteniendo la direccion del Deal Editado
    const dealUri = req.body.uri
    const personId = await obtenerPersonId(dealUri);
    const person = await cargarPerson(personId);
   // const dealUri = body.uri
    console.log("Deal Editado:", dealUri)
    console.log("Person Id:" , personId)
    console.log("Person:" , person)
    try {        
        res.status(200).send('Webhook recibido');
    } catch (error) {
        console.error('Error al obtener google sheet:', error);
        res.status(500).send('Error al obtener google sheet');
    }
};
async function obtenerPersonId(dealUri){
    const API_KEY = process.env.FOLLOW_BOSS_API_KEY;
    const options = {
        method: 'GET' , headers: {
            'Authorization': 'Basic ' + btoa(API_KEY + ':')
        }
    }
    const response = await fetch(dealUri, options);
    const data = await response.json();
    return data.people.id
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


