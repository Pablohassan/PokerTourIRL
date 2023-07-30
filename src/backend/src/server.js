import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const app = express();
app.options("*", cors());
app.use(cors({ origin: "http://localhost:5173" }));
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url}`);
    next();
});
app.use((req, res, next) => {
    console.log("Received request:", req.method, req.url);
    console.log("Response headers:", res.getHeaders());
    next();
});
app.use(express.json());
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
app.get('/season-points/:playerId/:tournamentId', async (req, res) => {
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
    const totalPoints = games.reduce((sum, game) => sum + game.points, 0);
    res.json({ totalPoints });
});
app.get('/player-total-cost/:playerId/:tournamentId', async (req, res) => {
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
    const totalCost = games.reduce((sum, game) => sum + game.buyin + game.rebuys, 0);
    res.json({ totalCost });
});
app.get('/player-gains/:playerId/:tournamentId', async (req, res) => {
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
    console.log('games:', games);
    const gains = games.reduce((sum, game) => {
        console.log('game.position:', game.position);
        console.log('game.totalCost:', game.totalCost);
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
app.get('player-total-rebuys/:playerId/:tournamentId', async (req, res) => {
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
                    party: true
                }
            }
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
            res.status(500).json({ error: "An error occurred while fetching the games" });
        }
    }
});
app.get("/tournament", async (req, res) => {
    const parties = await prisma.tournament.findMany({
        orderBy: {
            year: 'desc',
        },
    });
    res.json(parties);
});
app.get('/tournament/:year', async (req, res) => {
    const year = parseInt(req.params.year);
    const tournament = await prisma.tournament.findFirst({
        where: {
            year: year || 2023
        },
    });
    if (!tournament) {
        return res.status(404).json({ error: 'No tournament found for the given year.' });
    }
    res.json(tournament);
});
app.get("/party", async (req, res) => {
    const parties = await prisma.party.findMany({
        include: {
            playerStats: {
                include: {
                    player: true
                }
            }
        },
    });
    res.json(parties);
});
app.post("/tournament", async (req, res) => {
    const { year } = req.body;
    const tournament = await prisma.tournament.create({
        data: { year },
    });
    res.json(tournament);
});
app.post("/party", async (req, res) => {
    const { date, tournamentId } = req.body;
    const party = await prisma.party.create({
        data: { date, tournamentId },
    });
    res.json(party);
});
app.post('/player', async (req, res) => {
    try {
        const { name } = req.body;
        const { phoneNumber } = req.body;
        // Validate that a name was provided
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!phoneNumber) {
            return res.status(400).json({ error: 'Phone is required' });
        }
        const player = await prisma.player.create({
            data: { name, phoneNumber },
        });
        return res.json(player);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while creating the player' });
    }
});
app.post("/playerStats/start", async (req, res) => {
    const { players } = req.body;
    // Validate that players were provided
    if (!players || !Array.isArray(players) || players.length === 0) {
        return res.status(400).json({ error: 'At least one player is required' });
    }
    // Start a new game for each player
    try {
        for (const playerId of players) {
            // You may need to adjust this to match your game model
            const game = await prisma.playerStats.create({
                data: {
                    partyId: 1,
                    playerId,
                    points: 0,
                    buyin: 1,
                    rebuys: 0,
                    totalCost: 5,
                    position: 0,
                    outAt: Date()
                },
            });
        }
        return res.json({ message: 'New game started successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while starting the game' });
    }
});
// Assume each player provides playerId, points, and rebuys
app.post("/playerStats", async (req, res) => {
    try {
        const { partyId, playerId, points, rebuys, buyin, position, outAt } = req.body;
        if (!partyId || !playerId || points === undefined || rebuys === undefined) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const totalCost = buyin * 1;
        const game = await prisma.playerStats.create({
            data: { partyId, playerId, points, rebuys, buyin, totalCost, position,
                outAt },
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
const server = app.listen(3000, () => console.log(`Server is running on http://localhost:3000`));
process.on("SIGINT", () => {
    server.close(() => {
        prisma.$disconnect();
        console.log("Server closed.");
    });
});
//# sourceMappingURL=server.js.map