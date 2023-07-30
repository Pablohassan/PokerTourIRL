import { PrismaClient, Party, Player, PlayerStats } from "@prisma/client";

const prisma = new PrismaClient();

// Predefined list of player names
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
  const players: Player[] = [];
  for(let name of playersNameArr) {
    const player: Player = await prisma.player.create({
      data: {
        name: name, // Assign name from list
      },
    });
    players.push(player);
  }

  for(let i = 0; i < 10; i++) {
    // Create a Party
    const party: Party = await prisma.party.create({
      data: {
        date: new Date(Date.now() + (i * 7 * 24 * 60 * 60 * 1000)), // each party is 7 days apart
        tournamentId: tournament.id,
      },
    });

    // Assign stats for each player for the party
    for(let player of players) {
      const rebuys = Math.floor(Math.random() * 5);   // random rebuys

      const playerStats: PlayerStats = await prisma.playerStats.create({
        data: {
          partyId: party.id,
          playerId: player.id,
          points: Math.floor(Math.random() * 10),  // generate random points between 0-9
          buyin: 5,  // fixed buyin
          rebuys: rebuys,  // random rebuys
          position: Math.floor(Math.random() * 10), // random position
          totalCost: 5 + rebuys, // totalCost is sum of buyIn and reBuys
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

