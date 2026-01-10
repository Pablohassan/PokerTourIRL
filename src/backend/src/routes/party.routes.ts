import { Router } from 'express';
import { PartyController } from '../controllers/party.controller.js';

const router = Router();

router.get('/parties', PartyController.list);
router.get('/parties/state/:id', PartyController.getState);
router.get('/parties/:id', PartyController.getById);
router.get('/playerStatsByParty/:partyId', PartyController.getDetails);
router.get('/parties/:partyId/stats', PartyController.getDetails); // Dual path support

router.post('/parties', PartyController.create);
router.post('/playerStats/start', PartyController.startNewGame);

router.put('/parties/:id', PartyController.update);
router.delete('/parties/:id', PartyController.delete);

export default router;
