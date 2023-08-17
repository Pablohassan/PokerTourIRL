import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const playersNameArr = [
    "SuperJambon", "PabloHassan", "Pitch", "Dadoo", "Tam",
    "Arnaud", "Vincent", "Giorgio", "7Ka", "Lexa"
];
async function main() {
    // Create Tournament
    const tournament = await prisma.tournament.create({
        data: {
            year: 2023
        },
    });
    // Generate players based on predefined list
    const players = [];
    for (let name of playersNameArr) {
        const player = await prisma.player.create({
            data: {
                name: name,
            },
        });
        players.push(player);
    }
    for (let i = 0; i < 10; i++) {
        // Create a Party
        const party = await prisma.party.create({
            data: {
                date: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)),
                tournamentId: tournament.id,
            },
        });
        // Randomly shuffle players for each party to get positions
        const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
        for (let j = 0; j < shuffledPlayers.length; j++) {
            const player = shuffledPlayers[j];
            const rebuys = Math.floor(Math.random() * 5); // random rebuys
            const kills = Math.floor(Math.random() * 10); // random kills between 0-9
            // Determine points based on position (10th place gets 1 point, 9th gets 2, ..., 1st gets 10)
            const points = 10 - j;
            const playerStats = await prisma.playerStats.create({
                data: {
                    partyId: party.id,
                    playerId: player.id,
                    points: points,
                    kills: kills,
                    buyin: 5,
                    rebuys: rebuys,
                    position: j + 1,
                    totalCost: 5 + rebuys,
                },
            });
        }
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map