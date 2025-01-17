import express from 'express';
import { obtenerTodosLosDatos } from '../db/consultas.js'

const router = express.Router();

// Definir la ruta y el controlador
router.get('/follow-boss/datos', obtenerTodosLosDatos);

export default router;