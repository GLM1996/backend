import { getPipelines } from '../services/followBossService.js';

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
