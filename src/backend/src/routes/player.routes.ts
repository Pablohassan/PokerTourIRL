import { Router } from 'express';
import { PlayerController } from '../controllers/player.controller.js';

const router = Router();

// Standardize on plural /players in the main server.ts mounting, 
// but here we define the sub-pathes.

router.get('/player', PlayerController.list);
router.get('/playerStats', PlayerController.listAllStats);
router.get('/playerStats/:playerId', PlayerController.getAllTimeStats);
router.get('/gameResults/:playerId', PlayerController.getGameResults);
router.get('/season-points/:playerId/:tournamentId', PlayerController.getSeasonPoints);
router.get('/player-stats/:playerId/:tournamentId', PlayerController.getStats);

router.post('/players', PlayerController.create);
router.post('/playerStats', PlayerController.createStat);
router.post('/gameResults', PlayerController.updateMultipleStats);

router.put('/gamesResults/:id', PlayerController.updateStat);
router.put('/updateMultipleGamesResults', PlayerController.updateMultipleStats);
router.put('/playerStats/eliminate', PlayerController.eliminate);
router.put('/playerStats/out/:playerId', PlayerController.knockout);

export default router;
