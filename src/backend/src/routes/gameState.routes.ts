import { Router } from 'express';
import { GameStateController } from '../controllers/gameState.controller.js';

const router = Router();

router.get('/gameState', GameStateController.get);
router.post('/gameState', GameStateController.update);
router.delete('/gameState', GameStateController.delete);

export default router;
