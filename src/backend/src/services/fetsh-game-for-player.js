import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function fetchGamesForPlayer(playerId, tournamentId) {
    return await prisma.playerStats.findMany({
        where: {
            playerId: playerId,
            party: {
                tournamentId: tournamentId,
            },
        },
    });
}
//# sourceMappingURL=fetsh-game-for-player.js.map