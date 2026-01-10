import _ from 'lodash';
import prisma from '../lib/prisma.js';
import { calculatePartyGains } from '../../../utils/gainsCalculator.js';

export class PlayerService {
  /**
   * Fetch all players with their basic stats and parties
   */
  static async getAllPlayers() {
    return prisma.player.findMany({
      include: {
        stats: {
          include: {
            party: true,
          },
        },
      },
    });
  }

  /**
   * Fetch all player stats entries
   */
  static async getAllPlayerStats() {
    return prisma.playerStats.findMany({
      include: {
        player: true,
      },
    });
  }

  /**
   * Get total points for a player in a specific tournament
   */
  static async getSeasonPoints(playerId: number, tournamentId: number) {
    const stats = await prisma.playerStats.findMany({
      where: {
        playerId,
        party: {
          tournamentId,
        },
      },
    });

    return _.sumBy(stats, 'points');
  }

  /**
   * Get detailed stats (cost, gains, rebuys) for a player in a tournament
   */
  static async getPlayerTournamentStats(playerId: number, tournamentId: number) {
    const games = await prisma.playerStats.findMany({
      where: {
        playerId,
        party: {
          tournamentId,
        },
      },
    });

    const totalCost = _.sumBy(games, (game: any) => game.buyin + game.rebuys);
    const totalRebuys = _.sumBy(games, 'rebuys');

    const partyIds = Array.from(
      new Set(games.map((game: any) => game.partyId).filter(Boolean))
    );

    const partyStats = partyIds.length
      ? await prisma.playerStats.findMany({
          where: {
            partyId: { in: partyIds as number[] },
          },
        })
      : [];

    const statsByParty = _.groupBy(partyStats, 'partyId');

    const gains = partyIds.reduce((sum, partyId) => {
      const stats = statsByParty[partyId as number];
      if (!stats) return sum;
      return sum + calculatePartyGains(stats, playerId);
    }, 0);

    return { totalCost, gains, totalRebuys };
  }

  /**
   * Get a player's all-time stats (total points, total kills)
   */
  static async getPlayerAllTimeStats(playerId: number) {
    const stats = await prisma.playerStats.findMany({
      where: { playerId },
      include: { player: true },
    });

    const totalPoints = _.sumBy(stats, 'points');
    const totalKills = _.sumBy(stats, 'kills');

    return { totalPoints, totalKills, stats };
  }

  /**
   * Get last 10 game results for a player
   */
  static async getPlayerGameResults(playerId: number) {
    return prisma.playerStats.findMany({
      where: { playerId },
      include: { party: true },
      orderBy: { party: { date: 'desc' } },
      take: 10,
    });
  }

  /**
   * Create a new player
   */
  static async createPlayer(name: string, phoneNumber: string) {
    return prisma.player.create({
      data: { name, phoneNumber },
    });
  }

  /**
   * Create a new player stat entry
   */
  static async createPlayerStat(data: any) {
    const { buyin = 0 } = data;
    const totalCost = buyin * 1; // Legacy logic from server.ts
    
    return prisma.playerStats.create({
      data: {
        ...data,
        totalCost,
      },
      include: {
        party: true,
        player: true,
      },
    });
  }

  /**
   * Update a player's stat
   */
  static async updatePlayerStat(id: number, data: any) {
    return prisma.playerStats.update({
      where: { id },
      data,
    });
  }

  /**
   * Bulk update player stats
   */
  static async updateMultiplePlayerStats(updates: Array<{ id: number; data: any }>) {
    return Promise.all(
      updates.map((update) =>
        prisma.playerStats.update({
          where: { id: update.id },
          data: update.data,
        })
      )
    );
  }

  /**
   * Mark a player as out
   */
  static async knockOutPlayer(playerStatId: number) {
    return prisma.playerStats.update({
      where: { id: playerStatId },
      data: { outAt: new Date() },
    });
  }

  /**
   * Handle player elimination with killer bonus
   */
  static async eliminatePlayer(playerId: number, partyId: number, eliminatedById?: number) {
    const playerStatRecord = await prisma.playerStats.findFirst({
      where: { playerId, partyId },
    });

    if (!playerStatRecord) {
      throw new Error(`PlayerStats record for player ${playerId} in party ${partyId} not found`);
    }

    return prisma.$transaction(async (tx) => {
      // Mark as out
      const updatedPlayerStat = await tx.playerStats.update({
        where: { id: playerStatRecord.id },
        data: { outAt: new Date() },
      });

      // Bonus for killer
      if (eliminatedById) {
        const killerStats = await tx.playerStats.findFirst({
          where: { playerId: eliminatedById, partyId },
        });

        if (killerStats) {
          await tx.playerStats.update({
            where: { id: killerStats.id },
            data: { kills: killerStats.kills + 1 },
          });
        }
      }

      return updatedPlayerStat;
    });
  }
}
