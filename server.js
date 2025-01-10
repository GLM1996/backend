import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import cors from 'cors';
import followBossRoutes from './routes/followBossRoutes.js';

const router = express.Router();

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

// Usar las rutas definidas
app.use('/api', followBossRoutes);

// Servidor en ejecución
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
