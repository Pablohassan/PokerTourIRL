import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

export async function fetchGamesForPlayer(playerId: number, tournamentId: number) {
    return await prisma.playerStats.findMany({
      where: {
        playerId: playerId,
        party: {
          tournamentId: tournamentId,
        },
      },
    });
  }