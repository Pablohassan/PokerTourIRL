import { Request, Response, NextFunction } from 'express';
import { PlayerService } from '../services/player.service.js';
import { AppError } from '../middlewares/errorHandler.js';

export class PlayerController {
  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const players = await PlayerService.getAllPlayers();
      res.json(players);
    } catch (err) {
      next(err);
    }
  }

  static async getSeasonPoints(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId, tournamentId } = req.params;
      const totalPoints = await PlayerService.getSeasonPoints(Number(playerId), Number(tournamentId));
      res.json({ totalPoints });
    } catch (err) {
      next(err);
    }
  }

  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId, tournamentId } = req.params;
      const stats = await PlayerService.getPlayerTournamentStats(Number(playerId), Number(tournamentId));
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  static async getAllTimeStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId } = req.params;
      const stats = await PlayerService.getPlayerAllTimeStats(Number(playerId));
      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  static async getGameResults(req: Request, res: Response, next: NextFunction) {
    try {
      const playerId = Number(req.params.playerId);
      if (isNaN(playerId)) throw new AppError('Player ID must be a number', 400);

      const playerGames = await PlayerService.getPlayerGameResults(playerId);
      res.json({ playerGames });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, phoneNumber } = req.body;
      if (!name || !phoneNumber) throw new AppError('Name and PhoneNumber are required', 400);

      const player = await PlayerService.createPlayer(name, phoneNumber);
      res.json(player);
    } catch (err) {
      next(err);
    }
  }

  static async eliminate(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId, eliminatedById, partyId } = req.body;
      if (!playerId || !partyId) throw new AppError('Player ID and Party ID are required', 400);

      const updatedStats = await PlayerService.eliminatePlayer(
        Number(playerId),
        Number(partyId),
        eliminatedById ? Number(eliminatedById) : undefined
      );

      res.json({ message: 'Player stats updated successfully', updatedStats });
    } catch (err) {
      next(err);
    }
  }

  static async knockout(req: Request, res: Response, next: NextFunction) {
    try {
      const { playerId } = req.params;
      const updatedPlayerStat = await PlayerService.knockOutPlayer(Number(playerId));
      res.json({ message: 'Player knocked out successfully', updatedPlayerStat });
    } catch (err) {
      next(err);
    }
  }

  static async createStat(req: Request, res: Response, next: NextFunction) {
    try {
      const { partyId, playerId, points, rebuys, buyin, position, outAt, kills } = req.body;
      if (!partyId || !playerId || points === undefined || rebuys === undefined) {
        throw new AppError('All fields (partyId, playerId, points, rebuys) are required', 400);
      }
      const stat = await PlayerService.createPlayerStat({
        partyId, playerId, points, rebuys, buyin, position, outAt, kills
      });
      res.json(stat);
    } catch (err) {
      next(err);
    }
  }

  static async updateStat(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updatedGame = await PlayerService.updatePlayerStat(id, req.body);
      res.json(updatedGame);
    } catch (err) {
      next(err);
    }
  }

  static async updateMultipleStats(req: Request, res: Response, next: NextFunction) {
    try {
      const updates = req.body; // Array of { id, ...data } or { id, data }
      // The server.ts had two variants. POST /gameResults was array of {id, ...data}.
      // PUT /updateMultipleGamesResults was array of {id, data}.
      // I'll handle the standard one or both.
      const formattedUpdates = Array.isArray(updates) 
        ? updates.map(u => u.id ? { id: u.id, data: u.data || u } : u)
        : [];
      const updatedGames = await PlayerService.updateMultiplePlayerStats(formattedUpdates);
      res.json({ updatedGames });
    } catch (err) {
      next(err);
    }
  }

  static async listAllStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await PlayerService.getAllPlayerStats();
      if (stats.length === 0) {
        res.json({ message: 'No games found' });
      } else {
        res.json(stats);
      }
    } catch (err) {
      next(err);
    }
  }
}
