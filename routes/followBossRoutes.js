import express from 'express';
import { getFollowBossPipelines } from '../controllers/followBossController.js';
import { getGoogleSheet } from '../controllers/followBossController.js';
import { getWebhooks } from '../controllers/followBossController.js';
import { obtenerTodosLosDatos } from '../db/consultas.js';

const router = express.Router();

// Definir la ruta y el controlador
router.get('/follow-boss/pipelines', getFollowBossPipelines);

// Definir la ruta y el controlador
router.get('/google-sheet', getGoogleSheet);

// Definir la ruta y el controlador
router.post('/webhook', getWebhooks);

router.get('/webhook/data', obtenerTodosLosDatos)

export default router;
