import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
dotenv.config();
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { clerkMiddleware, requireAuth } from "@clerk/express";

import tournamentRoutes from './routes/tournament.routes.js';
import partyRoutes from './routes/party.routes.js';
import gameStateRoutes from './routes/gameState.routes.js';
import playerRoutes from './routes/player.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { initializeWebSocket, stopTimerBroadcast } from "./websocket/index.js";
import prisma from './lib/prisma.js';

const app = express();

app.set("trust proxy", 1);

const isDevelopment = process.env.NODE_ENV === "development";
const corsOrigin = isDevelopment
  ? "http://localhost:5173"
  : "https://bourlypokertour.fr";

app.use(express.json({ limit: "10mb" }));

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

// Modular Routes
app.use(playerRoutes);
app.use(tournamentRoutes);
app.use(partyRoutes);
app.use(gameStateRoutes);




// Final Universal Error Handler
app.use(errorHandler);

const port = process.env.PORT || 3000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize WebSocket on the same HTTP server
initializeWebSocket(server, corsOrigin);

server.listen(port, () =>
  console.log(`Server is running on https://bourlypokertour.fr :${port}`)
);

process.on("SIGINT", () => {
  stopTimerBroadcast();
  server.close(() => {
    prisma.$disconnect();
    console.log("Server closed.");
  });
});
