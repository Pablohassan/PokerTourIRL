import express from "express";
import _ from "lodash";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { fetchGamesForPlayer } from "./services/fetsh-game-for-player.js";
const prisma = new PrismaClient();
const app = express();
app.options("*", cors());
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());
app.use((req, res, next) => {
    console.log("Received request:", req.method, req.url);
    next();
});
app.get("/season-points/:playerId/:tournamentId", async (req, res, next) => {
    try {
        const playerId = parseInt(req.params.playerId);
        const tournamentId = parseInt(req.params.tournamentId);
        const games = await fetchGamesForPlayer(playerId, tournamentId);
        const totalPoints = _.sumBy(games, "points");
        res.json({ totalPoints });
    }
    catch (err) {
        next(err);
    }
});
app.get("/player-stats/:playerId/:tournamentId", async (req, res, next) => {
    try {
        const playerId = parseInt(req.params.playerId);
        const tournamentId = parseInt(req.params.tournamentId);
        const games = await fetchGamesForPlayer(playerId, tournamentId);
        // Calculate totalCost
        const totalCost = _.sumBy(games, (game) => game.buyin + game.rebuys);
        // Calculate gains
        const gains = _.sumBy(games, (game) => {
            let gain = 0;
            if (game.position === 1)
                gain = game.totalCost * 0.6;
            else if (game.position === 2)
                gain = game.totalCost * 0.3;
            else if (game.position === 3)
                gain = game.totalCost * 0.1;
            return gain;
        });
        // Calculate totalRebuys
        const totalRebuys = _.sumBy(games, "rebuys");
        // Return the calculated metrics in a single response
        res.json({ totalCost, gains, totalRebuys });
    }
    catch (err) {
        next(err);
    }
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
app.get("/playerStats", async (req, res, next) => {
    try {
        const games = await prisma.playerStats.findMany({
            include: {
                player: true,
            },
        });
        if (games.length === 0) {
            res.json({ message: "No games found" });
        }
        else {
            res.json(games);
        }
    }
    catch (err) {
        next(err);
    }
});
app.get("/playerStats/:playerId", async (req, res, next) => {
    try {
        const playerId = Number(req.params.playerId);
        const stats = await prisma.playerStats.findMany({
            where: { playerId: playerId },
            include: {
                player: true,
            },
        });
        const totalPoints = _.sumBy(stats, "points");
        const totalKills = _.sumBy(stats, "kills");
        res.json({ totalPoints, totalKills, stats });
    }
    catch (err) {
        next(err);
    }
});
app.get("/playerStatsByParty/:partyId", async (req, res, next) => {
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
    catch (err) {
        next(err);
    }
});
app.get("/tournaments", async (req, res, next) => {
    try {
        const tournaments = await prisma.tournament.findMany({
            orderBy: {
                year: "desc",
            },
        });
        res.json(tournaments);
    }
    catch (err) {
        next(err);
    }
});
app.get("/tournament/:year", async (req, res, next) => {
    const year = parseInt(req.params.year);
    try {
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
    }
    catch (err) {
        next(err);
    }
});
app.get("/parties", async (req, res, next) => {
    try {
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
    }
    catch (err) {
        next(err);
    }
});
app.get("/parties/state/:id", async (req, res, next) => {
    const { id } = req.params;
    try {
        const party = await prisma.party.findUnique({
            where: { id: Number(id) },
            select: { partyStarted: true, partyEnded: true },
        });
        res.json({
            partyStarted: party === null || party === void 0 ? void 0 : party.partyStarted,
            partyEnded: party === null || party === void 0 ? void 0 : party.partyEnded,
        });
    }
    catch (err) {
        next(err);
    }
});
app.get("/gameResults/:playerId", async (req, res, next) => {
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
    catch (err) {
        next(err);
    }
});
app.get("/parties/:id", async (req, res, next) => {
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
    catch (err) {
        next(err);
    }
});
app.get("/parties/:partyId/stats", async (req, res) => {
    const partyId = Number(req.params.partyId);
    const stats = await prisma.playerStats.findMany({
        where: { partyId: partyId },
        include: { player: true },
    });
    res.json(stats);
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
    const tournament = await prisma.tournament.findUnique({
        where: { id: actualTournamentId },
    });
    if (!tournament) {
        return res
            .status(400)
            .json({ error: "The specified tournament does not exist" });
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
    return res.json({
        message: "New game started successfully",
        playerStats: newPlayerStats,
    });
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
        console.log("Updated game:", updatedGame);
        res.json(updatedGame);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while updating the game result" });
    }
});
app.put("/updateMultipleGamesResults", async (req, res) => {
    try {
        const gameUpdates = req.body;
        const updatedGames = await Promise.all(gameUpdates.map(async (update) => {
            return await prisma.playerStats.update({
                where: { id: update.id },
                data: update.data,
            });
        }));
        res.json({ updatedGames });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the game results" });
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
        },
    });
    if (!playerStatRecord) {
        return res
            .status(404)
            .json({ error: `PlayerStats record with ID ${playerId} not found` });
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
        return res.json({
            message: "Player knocked out successfully",
            updatedPlayerStat,
        });
    }
    catch (error) {
        return res.status(400).json({ error: "Error knocking out player" });
    }
});
// Delete a specific party by its ID
app.delete("/parties/:id", async (req, res, next) => {
    try {
        const { id } = req.params; // Get the ID from the URL params
        // First delete related PlayerStats
        await prisma.playerStats.deleteMany({
            where: { partyId: Number(id) },
        });
        // Then delete the Party
        await prisma.party.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    }
    catch (err) {
        // Pass the error to the error-handling middleware
        next(err);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(err.status || 500)
        .json({ error: err.message || "Internal Server Error" });
});
const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
process.on("SIGINT", () => {
    server.close(() => {
        prisma.$disconnect();
        console.log("Server closed.");
    });
});
//# sourceMappingURL=server.js.map