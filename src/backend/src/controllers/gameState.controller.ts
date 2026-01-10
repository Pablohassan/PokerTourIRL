import { Request, Response, NextFunction } from 'express';
import { GameStateService } from '../services/gameState.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export class GameStateController {
  static async get(_req: Request, res: Response, next: NextFunction) {
    try {
      const state = await GameStateService.get();
      if (!state) throw new AppError('Game state not found', 404);
      res.json(state);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { state } = req.body;
      const updated = await GameStateService.update(state);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }

  static async delete(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await GameStateService.delete();
      res.json({ message: 'Game state deleted', count: result.count });
    } catch (err) {
      next(err);
    }
  }
}
