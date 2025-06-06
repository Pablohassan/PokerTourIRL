import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import { PrismaClient, Prisma } from "@prisma/client";
import { fetchGamesForPlayer } from "./services/fetsh-game-for-player.js";

const prisma = new PrismaClient();
const app = express();

app.set("trust proxy", 1);

const isDevelopment = process.env.NODE_ENV === "development";
const corsOrigin = isDevelopment
  ? "http://localhost:5173"
  : "https://bourlypokertour.fr";

app.use(bodyParser.json({ limit: "10mb" }));

app.use(helmet()); // HTTP security headers

if (!isDevelopment) {
  // Basic rate-limiting in prod
  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 5 min window
      max: 500, // limit each IP
      standardHeaders: true,
      legacyHeaders: false,
    })
  );
}

// Clerk: make sure secret key is configured
if (!process.env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY environment variable is not set");
}

app.use(clerkMiddleware());
// Configure CORS - Single configuration
app.use(
  cors({
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
  })
);

app.use(express.json());

app.use(requireAuth());

app.get(
  "/season-points/:playerId/:tournamentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerId = parseInt(req.params.playerId);
      const tournamentId = parseInt(req.params.tournamentId);

      const games = await fetchGamesForPlayer(playerId, tournamentId);

      const totalPoints = _.sumBy(games, "points");

      res.json({ totalPoints });
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/player-stats/:playerId/:tournamentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playerId = parseInt(req.params.playerId);
      const tournamentId = parseInt(req.params.tournamentId);

      const games = await fetchGamesForPlayer(playerId, tournamentId);

      // Calculate totalCost
      const totalCost = _.sumBy(games, (game: any) => game.buyin + game.rebuys);

      // Calculate gains
      const gains = _.sumBy(games, (game: any) => {
        let gain = 0;
        if (game.position === 1) gain = game.totalCost * 0.6;
        else if (game.position === 2) gain = game.totalCost * 0.3;
        else if (game.position === 3) gain = game.totalCost * 0.1;
        return gain;
      });

      // Calculate totalRebuys
      const totalRebuys = _.sumBy(games, "rebuys");

      // Return the calculated metrics in a single response
      res.json({ totalCost, gains, totalRebuys });
    } catch (err) {
      next(err);
    }
  }
);

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

app.get(
  "/playerStats",
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const games = await prisma.playerStats.findMany({
        include: {
          player: true,
        },
      });
      if (games.length === 0) {
        res.json({ message: "No games found" });
      } else {
        res.json(games);
      }
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/playerStats/:playerId",
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/playerStatsByParty/:partyId",
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/tournaments",
  // @ts-ignore
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tournaments = await prisma.tournament.findMany({
        orderBy: {
          year: "desc",
        },
      });
      res.json(tournaments);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/tournament/:year",
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  }
);
// @ts-ignore
app.get("/parties", async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 50, year } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  try {
    // Create base query conditions
    let whereCondition = {};

    // Add year filter if provided
    if (year) {
      const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
      const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);

      whereCondition = {
        date: {
          gte: yearStart,
          lte: yearEnd,
        },
      };
    }

    const parties = await prisma.party.findMany({
      where: whereCondition,
      skip,
      take: Number(limit),
      orderBy: {
        date: "desc",
      },
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
  } catch (err) {
    next(err);
  }
});

app.get(
  "/parties/state/:id",
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/gameResults/:playerId",
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/parties/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const party = await prisma.party.findUnique({
        where: { id: Number(id) },
      });
      if (!party) {
        return res.status(404).json({ error: "Party not found" });
      }
      res.json(party);
    } catch (err) {
      next(err);
    }
  }
);

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
  } catch (err) {
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
    } else {
      res.status(404).json({ error: "Game state not found" });
    }
  } catch (error) {
    console.error("Error fetching game state:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/tournaments", async (req: Request, res: Response) => {
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
app.post("/parties", async (req: Request, res: Response) => {
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

app.post("/players", async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the player" });
  }
});

app.post("/playerStats/start", async (req: Request, res: Response) => {
  const { players } = req.body;

  if (!players || !Array.isArray(players) || players.length < 4) {
    return res.status(400).json({ error: "At least 4 players are required" });
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

  const newParty = await prisma.party.create({
    data: {
      date: new Date(),
      tournamentId: currentYearTournament.id,
    },
  });

  const newPlayerStats: Prisma.PromiseReturnType<
    typeof prisma.playerStats.create
  >[] = [];

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
    // partyId: newParty.id,
  });
});

// Assume each player provides playerId, points, and rebuys

app.post("/playerStats", async (req: Request, res: Response) => {
  try {
    const { partyId, playerId, points, rebuys, buyin, position, outAt, kills } =
      req.body;

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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the game" });
  }
});

app.post("/gameResults", async (req: Request, res: Response) => {
  const games = req.body;
  const updatedGames: Prisma.PromiseReturnType<
    typeof prisma.playerStats.update
  >[] = [];

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
  } catch (error) {
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
    } else {
      const newGameState = await prisma.gameState.create({
        data: { state },
      });
      res.json(newGameState);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/gamesResults/:id", async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the game result" });
  }
});

app.put("/updateMultipleGamesResults", async (req: Request, res: Response) => {
  try {
    const gameUpdates: Array<{ id: number; data: any }> = req.body;

    const updatedGames = await Promise.all(
      gameUpdates.map(async (update) => {
        return await prisma.playerStats.update({
          where: { id: update.id },
          data: update.data,
        });
      })
    );

    res.json({ updatedGames });
  } catch (error) {
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
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the party date" });
  }
});

// sais pas comment ça fonctionne
app.put("/playerStats/eliminate", async (req: Request, res: Response) => {
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

app.put("/playerStats/out/:playerId", async (req: Request, res: Response) => {
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
  } catch (error) {
    return res.status(400).json({ error: "Error knocking out player" });
  }
});
// Delete a specific party by its ID
app.delete(
  "/parties/:id",
  async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (err) {
      // Pass the error to the error-handling middleware
      next(err);
    }
  }
);
// @ts-ignore
app.delete(
  "/gameState",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const deleteGameState = await prisma.gameState.deleteMany({});
      res.json({ message: "Game state deleted", count: deleteGameState.count });
    } catch (error) {
      console.error("Error deleting game state:", error);
      next(error);
    }
  }
);

// @ts-ignore
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`Server is running on https://bourlypokertour.fr :${port}`)
);

process.on("SIGINT", () => {
  server.close(() => {
    prisma.$disconnect();
    console.log("Server closed.");
  });
});
