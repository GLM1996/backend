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
    //const webhookData = req.headers;
    //obteniendo la direccion del Deal Editado
    const dealUri = req.body.uri
    //const personId = await obtenerPersonId(dealUri);
    //const person = await cargarPerson(personId);
    // const dealUri = body.uri
    try {
        const datosWebhook = await getWebhook(dealUri)
        console.log("Deal Editado:", datosWebhook.deal)
        console.log("Persona" , datosWebhook.person)
        console.log("Pipeline:", datosWebhook.pipeline)
        console.log("Stage:", datosWebhook.stage)

        res.status(200).send('Webhook recibido');
    } catch (error) {
        console.error('Error al obtener google sheet:', error);
        res.status(500).send('Error al obtener google sheet');
    }
};



