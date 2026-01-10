import { Router } from 'express';
import { TournamentController } from '../controllers/tournament.controller.js';

const router = Router();

router.get('/tournaments', TournamentController.list);
router.get('/tournament/:year', TournamentController.getByYear);
router.post('/tournaments', TournamentController.create);

export default router;
