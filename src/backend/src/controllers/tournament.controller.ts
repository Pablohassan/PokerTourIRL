import { Request, Response, NextFunction } from 'express';
import { TournamentService } from '../services/tournament.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export class TournamentController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const tournaments = await TournamentService.getAll();
      res.json(tournaments);
    } catch (err) {
      next(err);
    }
  }

  static async getByYear(req: Request, res: Response, next: NextFunction) {
    try {
      const year = parseInt(req.params.year);
      if (isNaN(year)) throw new AppError('Invalid year', 400);

      const tournament = await TournamentService.getByYear(year);
      if (!tournament) {
        throw new AppError('No tournament found for the given year.', 404);
      }

      res.json(tournament);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { year } = req.body;
      if (!year) throw new AppError('Year is required', 400);

      const newTournament = await TournamentService.create(Number(year));
      res.json(newTournament);
    } catch (err) {
      // Check for the error message from service
      if (err instanceof Error && err.message === 'Tournament for this year already exists') {
        return next(new AppError(err.message, 400));
      }
      next(err);
    }
  }
}
