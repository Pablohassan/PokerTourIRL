"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGamesForPlayer = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function fetchGamesForPlayer(playerId, tournamentId) {
    return await prisma.playerStats.findMany({
        where: {
            playerId: playerId,
            party: {
                tournamentId: tournamentId,
            },
        },
    });
}
exports.fetchGamesForPlayer = fetchGamesForPlayer;
