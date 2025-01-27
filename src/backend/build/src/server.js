import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { PrismaClient } from "@prisma/client";
import { fetchGamesForPlayer } from "./services/fetsh-game-for-player.js";
import { Server as SocketIOServer } from "socket.io";
import http from "http";
import { computeTimeLeftAndBlinds } from "../utility/computeTimeLeftAndBlinds.js";
const prisma = new PrismaClient();
const app = express();
const isDevelopment = process.env.NODE_ENV === "development";
const corsOrigin = isDevelopment
    ? "http://localhost:5173"
    : "https://bourlypokertour.fr";
app.use(bodyParser.json({ limit: "10mb" }));
// Configure CORS - Single configuration
app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
}));
app.use(express.json());
// Holds one timer interval ID per Party ID
// const activeTimers: Record<number, NodeJS.Timeout> = {};
const BLINDS = [
    { small: 10, big: 20, ante: 0, duration: 60 * 20 }, // 20 minutes
    { small: 25, big: 50, ante: 0, duration: 60 * 20 },
    { small: 50, big: 100, ante: 0, duration: 60 * 20 },
    { small: 100, big: 200, ante: 0, duration: 60 * 20 },
    { small: 150, big: 300, ante: 0, duration: 60 * 20 },
    { small: 200, big: 400, ante: 0, duration: 60 * 20 },
    { small: 250, big: 500, ante: 0, duration: 60 * 20 },
    { small: 300, big: 600, ante: 0, duration: 60 * 20 },
    { small: 400, big: 800, ante: 0, duration: 60 * 20 },
    { small: 500, big: 1000, ante: 0, duration: 60 * 20 },
    { small: 600, big: 1200, ante: 0, duration: 60 * 20 },
    { small: 700, big: 1400, ante: 0, duration: 60 * 20 },
    { small: 800, big: 1600, ante: 0, duration: 60 * 20 },
    { small: 900, big: 1800, ante: 0, duration: 60 * 20 },
    { small: 1000, big: 2000, ante: 0, duration: 60 * 20 },
    { small: 1200, big: 2400, ante: 0, duration: 60 * 20 },
    { small: 1500, big: 3000, ante: 0, duration: 60 * 20 },
    { small: 1600, big: 3200, ante: 0, duration: 60 * 20 },
    { small: 1800, big: 3600, ante: 0, duration: 60 * 20 },
    { small: 2000, big: 4000, ante: 0, duration: 60 * 20 },
    { small: 2000, big: 4000, ante: 0, duration: 60 * 20 },
    { small: 2500, big: 5000, ante: 0, duration: 60 * 20 },
    { small: 2500, big: 5000, ante: 0, duration: 60 * 20 },
    { small: 3000, big: 6000, ante: 0, duration: 60 * 20 },
    { small: 3000, big: 6000, ante: 0, duration: 60 * 20 },
];
function broadcastTimerUpdate(partyId, data) {
    // The clients will have joined this room so we can broadcast specifically
    io.to(`party-${partyId}`).emit("timerUpdate", data);
}
// @ts-ignore
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
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
// @ts-ignore
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
app.get("/playerStats", 
// @ts-ignore
async (req, res, next) => {
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
app.get("/tournaments", 
// @ts-ignore
async (req, res, next) => {
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
                year,
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
// @ts-ignore
app.get("/parties", async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    try {
        const parties = await prisma.party.findMany({
            skip,
            take: Number(limit),
            select: {
                id: true,
                date: true,
                playerStats: {
                    select: {
                        playerId: true,
                        points: true,
                        rebuys: true,
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
            partyStarted: party?.partyStarted,
            partyEnded: party?.partyEnded,
        });
    }
    catch (err) {
        next(err);
    }
});
app.get("/gameResults/:playerId", async (req, res, next) => {
    const playerId = Number(req.params.playerId);
    // Check if playerId is a number
    if (isNaN(playerId)) {
        return res.status(400).json({ error: "Player ID must be a number" });
    }
    // Check if playerId is not zero
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
            take: 10, // Limit the results to 10
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
    // Vérifiez si partyId est un nombre
    if (isNaN(partyId)) {
        return res.status(400).json({ error: "Party ID must be a number" });
    }
    try {
        const stats = await prisma.playerStats.findMany({
            where: { partyId: partyId },
            include: { player: true },
            take: 10, // Limit the results to 10
        });
        // Vérifiez si des statistiques ont été trouvées
        if (!stats || stats.length === 0) {
            return res
                .status(404)
                .json({ error: "No stats found for this party ID" });
        }
        res.json(stats);
    }
    catch (err) {
        console.log(`Error fetching stats for party id: ${partyId}: `, err);
        res.status(500).json({ error: "An error occurred while fetching stats" });
    }
});
// @ts-ignore
app.get("/gameState", async (req, res) => {
    try {
        const gameState = await prisma.gameState.findFirst(); // Find the first (and only) game state
        if (gameState) {
            res.json(gameState);
        }
        else {
            res.status(404).json({ error: "Game state not found" });
        }
    }
    catch (error) {
        console.error("Error fetching game state:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post("/timeState/pause", async (req, res) => {
    try {
        const { partyId } = req.body;
        if (!partyId) {
            return res.status(400).json({ error: "partyId is required" });
        }
        let timerState = await prisma.timerState.findUnique({ where: { partyId } });
        if (!timerState) {
            return res.status(404).json({ error: "No timeState for that party" });
        }
        // Must be running in order to pause
        if (timerState.status !== "running") {
            return res
                .status(400)
                .json({ error: "Timer is not in a running state, cannot pause" });
        }
        // Compute how many seconds remain
        const { timeLeft } = computeTimeLeftAndBlinds(timerState);
        // Update DB
        timerState = await prisma.timerState.update({
            where: { partyId },
            data: {
                status: "paused",
                pausedAt: new Date(),
                pauseOffset: Math.max(timeLeft, 0),
            },
        });
        const result = computeTimeLeftAndBlinds(timerState);
        broadcastTimerUpdate(partyId, result);
        return res.json(result);
    }
    catch (error) {
        console.error("Error pausing timer:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// post
app.post("/tournaments", async (req, res) => {
    const { year } = req.body;
    const existingTournament = await prisma.tournament.findFirst({
        where: { year },
    });
    if (existingTournament) {
        return res
            .status(400)
            .json({ error: "Tournament for this year already exists" });
    }
    const newTournament = await prisma.tournament.create({
        data: { year },
    });
    res.json(newTournament);
});
// modifié
app.post("/parties", async (req, res) => {
    const { date, tournamentId } = req.body;
    if (!tournamentId) {
        return res.status(400).json({ error: "Un ID de tournoi est requis." });
    }
    // Vérifier si le tournoi existe
    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
    });
    if (!tournament) {
        return res.status(400).json({ error: "Le tournoi spécifié n'existe pas." });
    }
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
    try {
        console.log("Received start request with players:", req.body.players);
        const { players } = req.body;
        if (!players || !Array.isArray(players) || players.length < 4) {
            console.log("Invalid players array:", players);
            return res.status(400).json({
                success: false,
                error: "At least 4 players are required",
            });
        }
        let currentYear = new Date().getFullYear();
        let currentYearTournament = await prisma.tournament.findFirst({
            where: { year: currentYear },
        });
        if (!currentYearTournament) {
            currentYearTournament = await prisma.tournament.create({
                data: { year: currentYear },
            });
        }
        console.log("Using tournament:", currentYearTournament);
        // Create new party first
        const newParty = await prisma.party.create({
            data: {
                date: new Date(),
                tournamentId: currentYearTournament.id,
            },
        });
        console.log("Created new party:", newParty);
        // Create player stats with the new party ID
        const newPlayerStats = await Promise.all(players.map(async (playerId) => {
            return await prisma.playerStats.create({
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
                include: {
                    player: true,
                },
            });
        }));
        console.log("Created player stats:", newPlayerStats);
        // Initialize timer state for the new party
        const timerState = await prisma.timerState.create({
            data: {
                partyId: newParty.id,
                status: "paused",
                levelIndex: 0,
                levelDuration: 1200, // 20 minutes in seconds
                startedAt: null,
                pausedAt: new Date(),
                pauseOffset: 1200,
            },
        });
        console.log("Created timer state:", timerState);
        // Return the response in the expected format
        const response = {
            success: true,
            playerStats: newPlayerStats,
            partyId: newParty.id,
            message: "New game started successfully",
        };
        console.log("Sending response:", JSON.stringify(response, null, 2));
        return res.status(200).json(response);
    }
    catch (error) {
        console.error("Error starting new game:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to start new game",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
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
                party: true, // include party data
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
                where: { id: id }, // find the game with the given id
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
app.post("/gameState", async (req, res) => {
    const { state } = req.body;
    try {
        const existingGameState = await prisma.gameState.findFirst();
        if (existingGameState) {
            const updatedGameState = await prisma.gameState.update({
                where: { id: existingGameState.id },
                data: { state },
            });
            res.json(updatedGameState);
        }
        else {
            const newGameState = await prisma.gameState.create({
                data: { state },
            });
            res.json(newGameState);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
app.put("/gamesResults/:id", async (req, res) => {
    try {
        const gameId = parseInt(req.params.id, 10); // Convert the id to a number
        if (isNaN(gameId)) {
            return res.status(400).json({ error: "Invalid game ID" });
        }
        const gameData = req.body;
        const updatedGame = await prisma.playerStats.update({
            where: { id: gameId },
            data: gameData,
        });
        res.json(updatedGame);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "An error occurred while updating the game result" });
    }
});
// Timer state endpoints
const handleTimerStart = async (req, res) => {
    try {
        console.log("Timer start request received:", req.body);
        const { partyId, levelIndex = 0 } = req.body;
        if (!partyId) {
            return res.status(400).json({ error: "partyId is required" });
        }
        let timerState = await prisma.timerState.findUnique({ where: { partyId } });
        if (!timerState) {
            console.log("Creating new timer state for party:", partyId);
            timerState = await prisma.timerState.create({
                data: {
                    partyId,
                    levelDuration: BLINDS[levelIndex].duration,
                    status: "running",
                    levelIndex,
                    startedAt: new Date(),
                    pausedAt: null,
                    pauseOffset: BLINDS[levelIndex].duration,
                },
            });
        }
        else {
            console.log("Updating existing timer state for party:", partyId);
            const nextLevelIdx = levelIndex ?? timerState.levelIndex;
            timerState = await prisma.timerState.update({
                where: { partyId },
                data: {
                    status: "running",
                    levelIndex: nextLevelIdx,
                    startedAt: new Date(),
                    pausedAt: null,
                    pauseOffset: BLINDS[nextLevelIdx].duration,
                },
            });
        }
        const result = computeTimeLeftAndBlinds(timerState);
        console.log("Timer start result:", result);
        broadcastTimerUpdate(partyId, result);
        return res.json(result);
    }
    catch (error) {
        console.error("Error starting timer:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
// Register the routes both with and without /api prefix
app.post("/timeState/start", handleTimerStart);
app.post("/api/timeState/start", handleTimerStart);
const handleTimerPause = async (req, res) => {
    try {
        console.log("Timer pause request received:", req.body);
        const { partyId } = req.body;
        if (!partyId) {
            return res.status(400).json({ error: "partyId is required" });
        }
        let timerState = await prisma.timerState.findUnique({ where: { partyId } });
        if (!timerState) {
            return res.status(404).json({ error: "No timeState for that party" });
        }
        if (timerState.status !== "running") {
            return res.status(400).json({ error: "Timer is not in a running state" });
        }
        const { timeLeft } = computeTimeLeftAndBlinds(timerState);
        timerState = await prisma.timerState.update({
            where: { partyId },
            data: {
                status: "paused",
                pausedAt: new Date(),
                pauseOffset: Math.max(timeLeft, 0),
            },
        });
        const result = computeTimeLeftAndBlinds(timerState);
        broadcastTimerUpdate(partyId, result);
        console.log("Timer pause response:", result);
        return res.json(result);
    }
    catch (error) {
        console.error("Error pausing timer:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
app.post("/timeState/pause", handleTimerPause);
app.post("/api/timeState/pause", handleTimerPause);
const handleTimerNextLevel = async (req, res) => {
    try {
        console.log("Next level request received:", req.body);
        const { partyId } = req.body;
        if (!partyId) {
            return res.status(400).json({ error: "partyId is required" });
        }
        let timerState = await prisma.timerState.findUnique({ where: { partyId } });
        if (!timerState) {
            return res.status(404).json({ error: "No timeState for that party" });
        }
        const nextIndex = timerState.levelIndex + 1;
        if (nextIndex >= BLINDS.length) {
            timerState = await prisma.timerState.update({
                where: { partyId },
                data: {
                    status: "ended",
                    levelIndex: timerState.levelIndex,
                },
            });
            const finalResult = computeTimeLeftAndBlinds(timerState);
            broadcastTimerUpdate(partyId, finalResult);
            return res.json(finalResult);
        }
        timerState = await prisma.timerState.update({
            where: { partyId },
            data: {
                levelIndex: nextIndex,
                status: "running",
                startedAt: new Date(),
                pausedAt: null,
                pauseOffset: BLINDS[nextIndex].duration,
            },
        });
        const result = computeTimeLeftAndBlinds(timerState);
        broadcastTimerUpdate(partyId, result);
        console.log("Next level response:", result);
        return res.json(result);
    }
    catch (error) {
        console.error("Error advancing to next level:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
app.post("/timeState/nextLevel", handleTimerNextLevel);
app.post("/api/timeState/nextLevel", handleTimerNextLevel);
const handleTimerEnd = async (req, res) => {
    try {
        console.log("Timer end request received:", req.body);
        const { partyId } = req.body;
        if (!partyId) {
            return res.status(400).json({ error: "partyId is required" });
        }
        let timerState = await prisma.timerState.findUnique({ where: { partyId } });
        if (!timerState) {
            return res.status(404).json({ error: "No timerState for that party" });
        }
        timerState = await prisma.timerState.update({
            where: { partyId },
            data: { status: "ended" },
        });
        const result = computeTimeLeftAndBlinds(timerState);
        broadcastTimerUpdate(partyId, result);
        console.log("Timer end response:", result);
        return res.json(result);
    }
    catch (error) {
        console.error("Error ending timer:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
app.post("/timeState/end", handleTimerEnd);
app.post("/api/timeState/end", handleTimerEnd);
//patch
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
        res
            .status(500)
            .json({ error: "An error occurred while updating the game results" });
    }
});
app.put("/parties/:id", async (req, res) => {
    let { date } = req.body; // Extract the new date from the request body
    const partyId = parseInt(req.params.id, 10); // Convert the id to a number
    date = new Date(date);
    // Validate the party ID
    if (isNaN(partyId)) {
        return res.status(400).json({ error: "Invalid party ID" });
    }
    try {
        const updatedParty = await prisma.party.update({
            where: { id: partyId },
            data: { date },
        });
        res.json(updatedParty);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "An error occurred while updating the party date" });
    }
});
// sais pas comment ça fonctionne
app.put("/playerStats/eliminate", async (req, res) => {
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
// @ts-ignore
app.delete("/gameState", async (_req, res, next) => {
    try {
        const deleteGameState = await prisma.gameState.deleteMany({});
        res.json({ message: "Game state deleted", count: deleteGameState.count });
    }
    catch (error) {
        console.error("Error deleting game state:", error);
        next(error);
    }
});
// @ts-ignore
app.use((err, req, res, next) => {
    console.error(err.stack);
    res
        .status(err.status || 500)
        .json({ error: err.message || "Internal Server Error" });
});
const port = process.env.PORT || 3000;
// const server = app.listen(port, () =>
//   console.log(`Server is running on https://bourlypokertour.fr :${port}`)
// );
// Create a raw HTTP server from express app
const httpServer = http.createServer(app);
const server = httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Now bind Socket.IO to that server
const io = new SocketIOServer(server, {
    cors: {
        origin: corsOrigin,
        credentials: true,
    },
});
//// Now `io` broadcast or listen events
io.on("connection", (socket) => {
    console.log("New client connected: " + socket.id);
    // The front-end should emit "joinParty" with the partyId, so that
    // it joins the correct room and only receives updates for that party
    socket.on("joinParty", (partyId) => {
        socket.join(`party-${partyId}`);
        console.log(`Socket ${socket.id} joined party room ${partyId}`);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
    });
});
process.on("SIGINT", () => {
    server.close(() => {
        prisma.$disconnect();
        console.log("Server closed.");
    });
});
// Add this endpoint to get timer state
app.get("/api/timeState/:partyId", async (req, res) => {
    try {
        const partyId = parseInt(req.params.partyId);
        if (!partyId) {
            return res.status(400).json({ error: "partyId is required" });
        }
        const timerState = await prisma.timerState.findUnique({
            where: { partyId },
        });
        if (!timerState) {
            return res
                .status(404)
                .json({ error: "No timer state found for this party" });
        }
        const result = computeTimeLeftAndBlinds(timerState);
        return res.json(result);
    }
    catch (error) {
        console.error("Error fetching timer state:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
// Add these endpoints to your backend router
app.get("/:partyId", async (req, res) => {
    const party = await prisma.party.findUnique({
        where: { id: Number(req.params.partyId) },
        include: {
            playerStats: { include: { player: true } },
            tournament: true,
        },
    });
    res.json(party);
});
app.post("/:partyId/player/:playerId", async (req, res) => {
    const { partyId, playerId } = req.params;
    const updateData = req.body;
    const updatedStats = await prisma.playerStats.update({
        where: {
            partyId_playerId: {
                partyId: Number(partyId),
                playerId: Number(playerId),
            },
        },
        data: updateData,
    });
    res.json(updatedStats);
});
