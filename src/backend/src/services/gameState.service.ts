import prisma from '../lib/prisma.js';

export class GameStateService {
  /**
   * Get current game state
   */
  static async get() {
    return prisma.gameState.findFirst();
  }

  /**
   * Update or create game state
   */
  static async update(state: any) {
    const existing = await this.get();
    if (existing) {
      return prisma.gameState.update({
        where: { id: existing.id },
        data: { state },
      });
    } else {
      return prisma.gameState.create({
        data: { state },
      });
    }
  }

  /**
   * Delete game state
   */
  static async delete() {
    return prisma.gameState.deleteMany({});
  }
}
