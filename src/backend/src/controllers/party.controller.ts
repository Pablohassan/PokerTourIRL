import { Request, Response, NextFunction } from 'express';
import { PartyService } from '../services/party.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export class PartyController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, year } = req.query;
      const parties = await PartyService.list(
        Number(page || 1),
        Number(limit || 50),
        year as string
      );
      res.json(parties);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new AppError('Invalid Party ID', 400);

      const party = await PartyService.getById(id);
      if (!party) throw new AppError('Party not found', 404);

      res.json(party);
    } catch (err) {
      next(err);
    }
  }

  static async getState(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new AppError('Invalid Party ID', 400);

      const party = await PartyService.getState(id);
      res.json({
        partyStarted: party?.partyStarted,
        partyEnded: party?.partyEnded,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const partyId = Number(req.params.partyId);
      if (!partyId) throw new AppError('A valid party ID is required', 400);

      const partyDetails = await PartyService.getStats(partyId);
      if (!partyDetails) throw new AppError('Party not found', 404);

      res.json(partyDetails.playerStats);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { date, tournamentId } = req.body;
      if (!tournamentId) throw new AppError('Tournament ID is required', 400);

      const party = await PartyService.create(new Date(date || Date.now()), Number(tournamentId));
      res.json(party);
    } catch (err) {
      next(err);
    }
  }

  static async startNewGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { players } = req.body;
      if (!players || !Array.isArray(players) || players.length < 4) {
        throw new AppError('At least 4 players are required', 400);
      }

      const result = await PartyService.startNewGame(players);
      res.json({
        message: 'New game started successfully',
        playerStats: result.playerStats,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const date = new Date(req.body.date);
      if (isNaN(id)) throw new AppError('Invalid party ID', 400);

      const updatedParty = await PartyService.update(id, date);
      res.json(updatedParty);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new AppError('Invalid party ID', 400);

      await PartyService.delete(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
