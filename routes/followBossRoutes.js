import express from 'express';
import { getFollowBossPipelines } from '../controllers/followBossController.js';

const router = express.Router();

// Definir la ruta y el controlador
router.get('/follow-boss/pipelines', getFollowBossPipelines);

export default router;
