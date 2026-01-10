import prisma from '../lib/prisma.js';
import { TournamentService } from './tournament.service.js';

export class PartyService {
  /**
   * List parties with pagination and year filter
   */
  static async list(page: number = 1, limit: number = 50, year?: string) {
    const skip = (page - 1) * limit;
    let whereCondition = {};

    if (year) {
      const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
      const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);
      whereCondition = {
        date: { gte: yearStart, lte: yearEnd },
      };
    }

    return prisma.party.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        date: true,
        playerStats: {
          select: {
            playerId: true,
            points: true,
            rebuys: true,
          },
        },
      },
    });
  }

  /**
   * Get party details by ID
   */
  static async getById(id: number) {
    return prisma.party.findUnique({
      where: { id },
    });
  }

  /**
   * Get party state (started/ended)
   */
  static async getState(id: number) {
    return prisma.party.findUnique({
      where: { id },
      select: { partyStarted: true, partyEnded: true },
    });
  }

  /**
   * Get party statistics including player details
   */
  static async getStats(id: number) {
    return prisma.party.findUnique({
      where: { id },
      include: {
        playerStats: {
          include: {
            player: true,
          },
        },
      },
    });
  }

  /**
   * Create a new party
   */
  static async create(date: Date, tournamentId: number) {
    // Verify tournament exists
    await TournamentService.getByYear(new Date(date).getFullYear());
    // Note: The legacy code used the provided tournamentId but let's be more robust if needed.
    // For now, let's stick to simple creation as in legacy.
    return prisma.party.create({
      data: { date, tournamentId },
    });
  }

  /**
   * Start a new game (Create party + player stats)
   */
  static async startNewGame(playerIds: number[]) {
    const tournament = await TournamentService.findOrCreateCurrentYear();

    const newParty = await prisma.party.create({
      data: {
        date: new Date(),
        tournamentId: tournament.id,
      },
    });

    const playerStats = await Promise.all(
      playerIds.map((playerId) =>
        prisma.playerStats.create({
          data: {
            partyId: newParty.id,
            playerId,
            points: 0,
            buyin: 1,
            rebuys: 0,
            totalCost: 5, // Default total cost as per legacy
            position: 0,
            outAt: null,
          },
        })
      )
    );

    return { party: newParty, playerStats };
  }

  /**
   * Update party date
   */
  static async update(id: number, date: Date) {
    return prisma.party.update({
      where: { id },
      data: { date },
    });
  }

  /**
   * Delete party and its stats
   */
  static async delete(id: number) {
    return prisma.$transaction([
      prisma.playerStats.deleteMany({ where: { partyId: id } }),
      prisma.party.delete({ where: { id } }),
    ]);
  }
}
