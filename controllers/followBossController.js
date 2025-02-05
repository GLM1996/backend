import { getPipelines } from '../services/followBossService.js';
import { getGoogleEnlaces } from '../services/followBossService.js';
import { peopleUpdated } from '../services/followBossService.js'
import { dealUpdated } from '../services/followBossService.js'


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
    const apiKey = process.env.FOLLOW_BOSS_API_KEY;
    //const webhookData = req.headers;
    //obteniendo la direccion del Deal Editado 
    const body = req.body
    const dealUri = req.body.uri
    console.log("Email :", body.email)
    console.log("Phone :", body.phone)
    console.log("Full Name :", body.full_name)
    //const personId = await obtenerPersonId(dealUri);
    //const person = await cargarPerson(personId);
    // const dealUri = body.uri
    try {
        if (body.event === 'dealsUpdated') {
            await peopleUpdated(apiKey, body.uri)
        } else if (body.event === 'peopleUpdated') {
            // await dealUpdated(apiKey, body.uri)
        } else if (body.workflow) {
            //encontrar la persona por email / phone / nombre
            // Hacer tres peticiones en paralelo (por nombre, email y móvil)
            let [responseName, responseEmail, responsePhone] = await Promise.all([
                fetch(`https://api.followupboss.com/v1/people?name=${body.full_name}`, options),
                fetch(`https://api.followupboss.com/v1/people?email=${body.email}`, options),
                fetch(`https://api.followupboss.com/v1/people?phone=${body.phone}`, options),
            ]);

            // Convertir las respuestas a JSON
            let resultName = await responseName.json();
            let resultEmail = await responseEmail.json();
            let resultPhone = await responsePhone.json();

            // Combinar los resultados eliminando duplicados
            let resultados = [...new Map(
                [...resultName.people, ...resultEmail.people, ...resultPhone.people].map(item => [item.id, item])
            ).values()];
            console.log('Resultados: ', resultados)
            return resultados

        }
        res.status(200).send('Webhook recibido');
    } catch (error) {
        console.error('Error al obtener gwebhooks:', error);
        res.status(500).send('Error al obtener gwebhooks');
    }
};





