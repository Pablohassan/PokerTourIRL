import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
app.options("*", cors());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url}`);
    next();
});
app.use((req, res, next) => {
    console.log("Received request:", req.method, req.url);
    console.log("Response headers:", res.getHeaders());
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use((req, res, next) => {
    console.log("Received request:", req.method, req.url);
    console.log("Response headers:", res.getHeaders());
    next();
});
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
app.get("/season-points/:playerId/:tournamentId", async (req, res) => {
    const playerId = parseInt(req.params.playerId);
    const tournamentId = parseInt(req.params.tournamentId);
    const games = await fetchGamesForPlayer(playerId, tournamentId);
    const totalPoints = games.reduce((sum, game) => sum + game.points, 0);
    res.json({ totalPoints });
});
app.get("/player-total-cost/:playerId/:tournamentId", async (req, res) => {
    const playerId = parseInt(req.params.playerId);
    const tournamentId = parseInt(req.params.tournamentId);
    const games = await fetchGamesForPlayer(playerId, tournamentId);
    const totalCost = games.reduce((sum, game) => sum + game.buyin + game.rebuys, 0);
    res.json({ totalCost });
});
app.get("/player-gains/:playerId/:tournamentId", async (req, res) => {
    const playerId = parseInt(req.params.playerId);
    const tournamentId = parseInt(req.params.tournamentId);
    const games = await prisma.playerStats.findMany({
        where: {
            playerId: playerId,
            party: {
                tournamentId: tournamentId,
            },
        },
    });
    console.log("games:", games);
    const gains = games.reduce((sum, game) => {
        console.log("game.position:", game.position);
        console.log("game.totalCost:", game.totalCost);
        let gain = 0;
        if (game.position === 1)
            gain = game.totalCost * 0.6;
        else if (game.position === 2)
            gain = game.totalCost * 0.3;
        else if (game.position === 3)
            gain = game.totalCost * 0.1;
        return sum + gain;
    }, 0);
    res.json({ gains });
});
app.get("/player-total-rebuys/:playerId/:tournamentId", async (req, res) => {
    const playerId = parseInt(req.params.playerId);
    const tournamentId = parseInt(req.params.tournamentId);
    const games = await prisma.playerStats.findMany({
        where: {
            playerId: playerId,
            party: {
                tournamentId: tournamentId,
            },
        },
    });
    const totalRebuys = games.reduce((sum, game) => sum + game.rebuys, 0);
    res.json({ totalRebuys });
});
app.get("/player", async (req, res) => {
    const players = await prisma.player.findMany({
        include: {
            stats: {
                include: {
                    party: true,
                },
            },
        },
    });
    res.json(players);
});
app.get("/playerStats", async (req, res) => {
    try {
        const games = await prisma.playerStats.findMany({});
        if (games.length === 0) {
            res.json({ message: "No games found" });
        }
        else {
            res.json(games);
        }
    }
    catch (error) {
        console.error("Error occurred in /game route: ", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res
                .status(500)
                .json({ error: "An error occurred while fetching the games" });
        }
    }
});
app.get("/playerStats/:playerId", async (req, res) => {
    const { playerId } = req.params;
    try {
        const playerStats = await prisma.playerStats.findMany({
            where: { playerId: Number(playerId) },
            include: {
                party: true,
                player: true,
            },
        });
        res.json(playerStats);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching player statistics" });
    }
});
app.get("/playerStatsByParty/:partyId", async (req, res) => {
    const partyId = Number(req.params.partyId);
    if (!partyId) {
        return res.status(400).json({ error: "A valid party ID is required" });
    }
    try {
        const partyDetails = await prisma.party.findUnique({
            where: {
                id: partyId,
            },
            include: {
                playerStats: {
                    include: {
                        player: true, // Including player details in the response
                    },
                },
            },
        });
        if (!partyDetails) {
            return res.status(404).json({ error: "Party not found" });
        }
        return res.json(partyDetails);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching the party details" });
    }
});
app.get("/tournaments", async (req, res) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            orderBy: {
                year: "desc",
            },
        });
        res.json(tournaments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching tournaments" });
    }
});
app.get("/tournament/:year", async (req, res) => {
    const year = parseInt(req.params.year);
    const tournament = await prisma.tournament.findFirst({
        where: {
            year: year || 2023,
        },
    });
    if (!tournament) {
        return res
            .status(404)
            .json({ error: "No tournament found for the given year." });
    }
    res.json(tournament);
});
app.get("/parties", async (req, res) => {
    const parties = await prisma.party.findMany({
        include: {
            playerStats: {
                include: {
                    player: true,
                },
            },
        },
    });
    res.json(parties);
});
app.get("/gameResults/:playerId", async (req, res) => {
    const playerId = Number(req.params.playerId);
    if (!playerId) {
        return res.status(400).json({ error: "A valid player ID is required" });
    }
    try {
        const playerGames = await prisma.playerStats.findMany({
            where: {
                playerId: playerId,
            },
            include: {
                party: true, // Including party details for context
            },
        });
        if (!playerGames || playerGames.length === 0) {
            return res
                .status(404)
                .json({ error: "Games for the specified player not found" });
        }
        return res.json({ playerGames });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while fetching the game results" });
    }
});
app.get("/parties/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const party = await prisma.party.findUnique({
            where: { id: Number(id) },
        });
        if (!party) {
            return res.status(404).json({ error: "Party not found" });
        }
        res.json(party);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching the party" });
    }
});
app.post("/tournaments", async (req, res) => {
    const { year } = req.body;
    const tournaments = await prisma.tournament.create({
        data: { year },
    });
    res.json(tournaments);
});
app.post("/parties", async (req, res) => {
    const { date, tournamentId } = req.body;
    const parties = await prisma.party.create({
        data: { date, tournamentId },
    });
    res.json(parties);
});
app.post("/players", async (req, res) => {
    try {
        const { name } = req.body;
        const { phoneNumber } = req.body;
        // Validate that a name was provided
        if (!name || !phoneNumber) {
            return res.status(400).json({ error: "Name is required" });
        }
        if (!phoneNumber) {
            return res.status(400).json({ error: "Phone is required" });
        }
        const player = await prisma.player.create({
            data: { name, phoneNumber },
        });
        return res.json(player);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while creating the player" });
    }
});
app.post("/playerStats/start", async (req, res) => {
    const { players, tournamentId } = req.body;
    if (!players || !Array.isArray(players) || players.length < 4) {
        return res.status(400).json({ error: "At least 4 players are required" });
    }
    let currentYearTournament = await prisma.tournament.findFirst({
        where: {
            year: new Date().getFullYear(),
        },
    });
    if (!currentYearTournament) {
        currentYearTournament = await prisma.tournament.create({
            data: {
                year: new Date().getFullYear(),
            },
        });
    }
    const actualTournamentId = currentYearTournament.id;
    const tournament = await prisma.tournament.findUnique({ where: { id: actualTournamentId } });
    if (!tournament) {
        return res.status(400).json({ error: "The specified tournament does not exist" });
    }
    // Create a new party
    const newParty = await prisma.party.create({
        data: {
            date: new Date(),
            tournamentId: actualTournamentId,
        },
    });
    const newPlayerStats = [];
    for (const playerId of players) {
        // Start a new game for each player
        const playerStat = await prisma.playerStats.create({
            data: {
                partyId: newParty.id,
                playerId,
                points: 0,
                buyin: 1,
                rebuys: 0,
                totalCost: 5,
                position: 0,
                outAt: null,
            },
        });
        newPlayerStats.push(playerStat);
    }
    return res.json({ message: "New game started successfully", playerStats: newPlayerStats });
});
// Assume each player provides playerId, points, and rebuys
app.post("/playerStats", async (req, res) => {
    try {
        const { partyId, playerId, points, rebuys, buyin, position, outAt, kills } = req.body;
        if (!partyId || !playerId || points === undefined || rebuys === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const totalCost = buyin * 1;
        const game = await prisma.playerStats.create({
            data: {
                partyId,
                playerId,
                points,
                rebuys,
                buyin,
                totalCost,
                position,
                outAt,
                kills,
            },
            include: {
                party: true,
                player: true, // include player data
            },
        });
        res.json(game);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while creating the game" });
    }
});
app.post("/gameResults", async (req, res) => {
    const games = req.body;
    const updatedGames = [];
    try {
        for (const game of games) {
            const { id, ...gameData } = game; // extract the id from the game data
            const updatedGame = await prisma.playerStats.update({
                where: { id: id },
                data: gameData, // update the game with the rest of the game data
            });
            updatedGames.push(updatedGame);
        }
        res.json({ updatedGames });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while saving the game results" });
    }
});
app.put("/gamesResults/:id", async (req, res) => {
    try {
        const gameId = parseInt(req.params.id, 10); // Convert the id to a number
        if (isNaN(gameId)) {
            return res.status(400).json({ error: "Invalid game ID" });
        }
        const gameData = req.body;
        console.log("Received game data:", req.body);
        const updatedGame = await prisma.playerStats.update({
            where: { id: gameId },
            data: gameData,
        });
        res.json(updatedGame);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while updating the game result" });
    }
});
// sais pas comment ça fonctionne 
app.put("/playerStats/eliminate", async (req, res) => {
    console.log("Request received at /playerStats/eliminate");
    const { playerId, eliminatedById, partyId } = req.body;
    if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
    }
    const playerStatRecord = await prisma.playerStats.findFirst({
        where: {
            playerId: playerId,
            partyId: partyId,
        }
    });
    if (!playerStatRecord) {
        return res.status(404).json({ error: `PlayerStats record with ID ${playerId} not found` });
    }
    // Database transaction ensures that if one operation fails, all fail (for data consistency)
    const updatedStats = await prisma.$transaction(async (prisma) => {
        // Mark the player as eliminated (out)
        const updatedPlayerStat = await prisma.playerStats.update({
            where: { id: playerStatRecord.id },
            data: { outAt: new Date() },
        });
        // If a killer (eliminator) is provided, increase their kill count
        if (eliminatedById) {
            const killerStats = await prisma.playerStats.findFirst({
                where: {
                    playerId: eliminatedById,
                    // Add more conditions if necessary, e.g. partyId
                },
            });
            if (!killerStats) {
                throw new Error("Killer stats not found");
            }
            await prisma.playerStats.update({
                where: {
                    id: killerStats.id,
                },
                data: {
                    kills: killerStats.kills + 1,
                },
            });
        }
        return updatedPlayerStat;
    });
    // If successful, send the updated player stats
    res.json({ message: "Player stats updated successfully", updatedStats });
});
app.put("/playerStats/out/:playerId", async (req, res) => {
    const { playerId } = req.params;
    if (!playerId) {
        return res.status(400).json({ error: "Player ID is required" });
    }
    try {
        const updatedPlayerStat = await prisma.playerStats.update({
            where: { id: Number(playerId) },
            data: { outAt: new Date() },
        });
        return res.json({ message: "Player knocked out successfully", updatedPlayerStat });
    }
    catch (error) {
        return res.status(400).json({ error: "Error knocking out player" });
    }
});
const server = app.listen(3000, () => console.log(`Server is running on http://localhost:3000`));
process.on("SIGINT", () => {
    server.close(() => {
        prisma.$disconnect();
        console.log("Server closed.");
    });
});
//# sourceMappingURL=server.js.map