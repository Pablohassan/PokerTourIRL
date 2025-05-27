import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
/**
 * Computes the remaining time for the current blind cycle.
 * @param startTime - The timestamp when the current blind level started.
 * @param blindDuration - The duration (in minutes) for the current blind level.
 * @returns Time left in milliseconds.
 */
export const getComputedTimeLeft = (
  startTime: number,
  blindDuration: number
): number => {
  const elapsed = Date.now() - startTime;
  const totalDuration = blindDuration * 60 * 1000;
  return Math.max(totalDuration - elapsed, 0);
};

/**
 * Updates the game state with new startTime and blindDuration.
 * @param state - The new state sent from the client.
 * @returns The updated state.
 */
export const updateGameStateData = async (state: any): Promise<any> => {
  // For example, update using Prisma:
  // If a new blind cycle is started, update the startTime:
  if (state.resetTimer) {
    state.startTime = Date.now();
  }
  // Save the state using Prisma or your ORM
  const updatedState = await prisma.gameState.update({
    where: { id: state.id },
    data: state,
  });
  return updatedState;
};
