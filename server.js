import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://127.0.0.1:5500'  // Especifica tu origen
}));

// Middleware para manejar JSON
app.use(bodyParser.json());

// Endpoint para obtener datos de Google Sheets
app.get('/google-sheet', async (req, res) => {

    const sheetId = process.env.SHEET_ID; // Definido en .env
    const range = 'Enlaces!A2:B';
    const apiKey = process.env.GOOGLE_API_KEY; // Definido en .env

    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(range)}?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data.values || []);
    } catch (error) {
        console.error('Error al obtener Google Sheets:', error);
        res.status(500).send('Error al obtener Google Sheets');
    }
});

// Endpoint para obtener deals de Follow Up Boss
app.get('/follow-boss/deals', async (req, res) => {
    const apiKey = process.env.FOLLOW_BOSS_API_KEY; // Definido en .env
    const { personName } = req.query;

    if (!personName) return res.status(400).send('El parámetro personId es obligatorio');

    let allDeals = [];
    let url = `https://api.followupboss.com/v1/deals?name=${personName}&status=Active&limit=100`;

    try {
        while (url) {
            const response = await fetch(url, {
                headers: { 'Authorization': 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64') }
            });
            const data = await response.json();

            allDeals = [...allDeals, ...(data.deals || [])];
            url = data._metadata?.nextLink || null;
        }
        res.json(allDeals);
    } catch (error) {
        console.error('Error al obtener deals:', error);
        res.status(500).send('Error al obtener deals');
    }
});
// Endpoint para cargar pipelines deals de Follow Up Boss
app.get('/follow-boss/pipelines', async (req, res) => {
    const apiKey = process.env.FOLLOW_BOSS_API_KEY; // Definido en .env

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
        res.json(allPipelines);
    } catch (error) {
        console.error('Error al obtener deals:', error);
        res.status(500).send('Error al obtener deals');
    }
});

// Servidor en ejecución
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
