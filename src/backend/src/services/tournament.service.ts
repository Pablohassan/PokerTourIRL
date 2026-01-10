import prisma from '../lib/prisma.js';

export class TournamentService {
  /**
   * Get all tournaments ordered by year descending
   */
  static async getAll() {
    return prisma.tournament.findMany({
      orderBy: { year: 'desc' },
    });
  }

  /**
   * Get a single tournament by year
   */
  static async getByYear(year: number) {
    return prisma.tournament.findFirst({
      where: { year },
    });
  }

  /**
   * Create a new tournament for a specific year
   */
  static async create(year: number) {
    // Check if already exists
    const existing = await this.getByYear(year);
    if (existing) {
      throw new Error('Tournament for this year already exists');
    }

    return prisma.tournament.create({
      data: { year },
    });
  }

  /**
   * Find or create tournament for the current year
   */
  static async findOrCreateCurrentYear() {
    const year = new Date().getFullYear();
    let tournament = await this.getByYear(year);
    
    if (!tournament) {
      tournament = await prisma.tournament.create({
        data: { year },
      });
    }
    
    return tournament;
  }
}
