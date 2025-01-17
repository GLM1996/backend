import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import followBossRoutes from './routes/followBossRoutes.js';

const router = express.Router();

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use(cors({
    origin: 'http://127.0.0.1:5500'  // Especifica tu origen
}));

// Middleware para manejar JSON
app.use(bodyParser.json());

// Usar las rutas definidas
app.use('/api', followBossRoutes);

/*app.use((req, res, next) => {
    console.log('Nueva solicitud entrante:');
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Cabeceras:', req.headers);
    console.log('Cuerpo:', req.body);

    next(); // Continúa con la siguiente ruta
});*/


// Servidor en ejecución
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
