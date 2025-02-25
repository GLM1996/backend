import { getPipelines } from '../services/followBossService.js';
import { getGoogleEnlaces } from '../services/followBossService.js';
import { peopleUpdated, createNoteForPerson } from '../services/followBossService.js'


const API_KEY = process.env.FOLLOW_BOSS_API_KEY;

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
    const body = req.body
    const dealUri = req.body.uri
    console.log("Email :", body.email)
    console.log("Phone :", body.phone)
    console.log("Full Name :", body.full_name)
    console.log("workflow :", body.workflow)
    let result
    //const personId = await obtenerPersonId(dealUri);
    //const person = await cargarPerson(personId);
    // const dealUri = body.uri
    try {
        if (body.event === 'dealsUpdated') {
            await peopleUpdated(API_KEY, body.uri)
        } else if (body.event === 'peopleUpdated') {
            // await dealUpdated(apiKey, body.uri)
        } else if (body.workflow) {
            const options = {
                method: 'GET', headers: {
                    'Authorization': 'Basic ' + btoa(API_KEY + ':') // Usamos 'Basic' y la clave API codificada en base64
                }
            }
            //encontrar la persona por email / phone / nombre
            // Hacer tres peticiones en paralelo (por nombre, email y móvil)
            let result;
            // Primero, busca por correo electrónico
            // Primero, busca por correo electrónico
            let responseEmail = await fetch(`https://api.followupboss.com/v1/people?email=${body.email}`, options);
            result = await responseEmail.json();

            if (result._metadata.total !== 0) {
                // Si encuentra resultados por email, realiza las acciones
                //acciones
                createNoteForPerson(API_KEY,result.people[0])
                return; // Termina la ejecución
            }

            // Si no encontró resultados por email, busca por teléfono
            let responsePhone = await fetch(`https://api.followupboss.com/v1/people?phone=${body.phone}`, options);
            result = await responsePhone.json();

            if (result._metadata.total !== 0) {
                // Si encuentra resultados por teléfono, realiza las acciones
                //acciones
                createNoteForPerson(API_KEY,result.people[0])
                return; // Termina la ejecución
            }

           console.log('bucar person')
        }
        res.status(200).send('Webhook recibido');
    } catch (error) {
        console.error('Error al obtener gwebhooks:', error);
        res.status(500).send('Error al obtener gwebhooks');
    }
};





