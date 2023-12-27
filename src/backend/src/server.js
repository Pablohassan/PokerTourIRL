"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var lodash_1 = require("lodash");
var cors_1 = require("cors");
var client_1 = require("@prisma/client");
var fetsh_game_for_player_js_1 = require("./services/fetsh-game-for-player.js");
var prisma = new client_1.PrismaClient();
var app = (0, express_1.default)();
app.options("*", (0, cors_1.default)());
app.use((0, cors_1.default)({ origin: process.env.CORS_ORIGIN || "https://bourlypokertour.fr" }));
app.use(express_1.default.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://bourlypokertour.fr");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express_1.default.json());
app.use(function (req, res, next) {
    console.log("Received request:", req.method, req.url);
    next();
});
app.get("/season-points/:playerId/:tournamentId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, tournamentId, games, totalPoints, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                playerId = parseInt(req.params.playerId);
                tournamentId = parseInt(req.params.tournamentId);
                return [4 /*yield*/, (0, fetsh_game_for_player_js_1.fetchGamesForPlayer)(playerId, tournamentId)];
            case 1:
                games = _a.sent();
                totalPoints = lodash_1.default.sumBy(games, "points");
                res.json({ totalPoints: totalPoints });
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/player-stats/:playerId/:tournamentId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, tournamentId, games, totalCost, gains, totalRebuys, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                playerId = parseInt(req.params.playerId);
                tournamentId = parseInt(req.params.tournamentId);
                return [4 /*yield*/, (0, fetsh_game_for_player_js_1.fetchGamesForPlayer)(playerId, tournamentId)];
            case 1:
                games = _a.sent();
                totalCost = lodash_1.default.sumBy(games, function (game) { return game.buyin + game.rebuys; });
                gains = lodash_1.default.sumBy(games, function (game) {
                    var gain = 0;
                    if (game.position === 1)
                        gain = game.totalCost * 0.6;
                    else if (game.position === 2)
                        gain = game.totalCost * 0.3;
                    else if (game.position === 3)
                        gain = game.totalCost * 0.1;
                    return gain;
                });
                totalRebuys = lodash_1.default.sumBy(games, "rebuys");
                // Return the calculated metrics in a single response
                res.json({ totalCost: totalCost, gains: gains, totalRebuys: totalRebuys });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/player", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var players;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.player.findMany({
                    include: {
                        stats: {
                            include: {
                                party: true,
                            },
                        },
                    },
                })];
            case 1:
                players = _a.sent();
                res.json(players);
                return [2 /*return*/];
        }
    });
}); });
app.get("/playerStats", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var games, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.playerStats.findMany({
                        include: {
                            player: true,
                        },
                    })];
            case 1:
                games = _a.sent();
                if (games.length === 0) {
                    res.json({ message: "No games found" });
                }
                else {
                    res.json(games);
                }
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                next(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/playerStats/:playerId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, stats, totalPoints, totalKills, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                playerId = Number(req.params.playerId);
                return [4 /*yield*/, prisma.playerStats.findMany({
                        where: { playerId: playerId },
                        include: {
                            player: true,
                        },
                    })];
            case 1:
                stats = _a.sent();
                totalPoints = lodash_1.default.sumBy(stats, "points");
                totalKills = lodash_1.default.sumBy(stats, "kills");
                res.json({ totalPoints: totalPoints, totalKills: totalKills, stats: stats });
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                next(err_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/playerStatsByParty/:partyId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var partyId, partyDetails, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                partyId = Number(req.params.partyId);
                if (!partyId) {
                    return [2 /*return*/, res.status(400).json({ error: "A valid party ID is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.party.findUnique({
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
                    })];
            case 2:
                partyDetails = _a.sent();
                if (!partyDetails) {
                    return [2 /*return*/, res.status(404).json({ error: "Party not found" })];
                }
                return [2 /*return*/, res.json(partyDetails)];
            case 3:
                err_5 = _a.sent();
                next(err_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/tournaments", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var tournaments, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.tournament.findMany({
                        orderBy: {
                            year: "desc",
                        },
                    })];
            case 1:
                tournaments = _a.sent();
                res.json(tournaments);
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                next(err_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/tournament/:year", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var year, tournament, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = parseInt(req.params.year);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.tournament.findFirst({
                        where: {
                            year: year || 2023,
                        },
                    })];
            case 2:
                tournament = _a.sent();
                if (!tournament) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "No tournament found for the given year." })];
                }
                res.json(tournament);
                return [3 /*break*/, 4];
            case 3:
                err_7 = _a.sent();
                next(err_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/parties", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var parties, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.party.findMany({
                        include: {
                            playerStats: {
                                include: {
                                    player: true,
                                },
                            },
                        },
                    })];
            case 1:
                parties = _a.sent();
                res.json(parties);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                next(err_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/parties/state/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, party, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.party.findUnique({
                        where: { id: Number(id) },
                        select: { partyStarted: true, partyEnded: true },
                    })];
            case 2:
                party = _a.sent();
                res.json({
                    partyStarted: party === null || party === void 0 ? void 0 : party.partyStarted,
                    partyEnded: party === null || party === void 0 ? void 0 : party.partyEnded,
                });
                return [3 /*break*/, 4];
            case 3:
                err_9 = _a.sent();
                next(err_9);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/gameResults/:playerId", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, playerGames, err_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                playerId = Number(req.params.playerId);
                // Check if playerId is a number
                if (isNaN(playerId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Player ID must be a number" })];
                }
                // Check if playerId is not zero
                if (!playerId) {
                    return [2 /*return*/, res.status(400).json({ error: "A valid player ID is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.playerStats.findMany({
                        where: {
                            playerId: playerId,
                        },
                        include: {
                            party: true, // Including party details for context
                        },
                        take: 10, // Limit the results to 10
                    })];
            case 2:
                playerGames = _a.sent();
                if (!playerGames || playerGames.length === 0) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "Games for the specified player not found" })];
                }
                return [2 /*return*/, res.json({ playerGames: playerGames })];
            case 3:
                err_10 = _a.sent();
                next(err_10);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/parties/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, party, err_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.party.findUnique({
                        where: { id: Number(id) },
                    })];
            case 2:
                party = _a.sent();
                if (!party) {
                    return [2 /*return*/, res.status(404).json({ error: "Party not found" })];
                }
                res.json(party);
                return [3 /*break*/, 4];
            case 3:
                err_11 = _a.sent();
                next(err_11);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/parties/:partyId/stats", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var partyId, stats, err_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                partyId = Number(req.params.partyId);
                // Vérifiez si partyId est un nombre
                if (isNaN(partyId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Party ID must be a number" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("Fetching stats for party id: ".concat(partyId));
                return [4 /*yield*/, prisma.playerStats.findMany({
                        where: { partyId: partyId },
                        include: { player: true },
                        take: 10, // Limit the results to 10
                    })];
            case 2:
                stats = _a.sent();
                console.log("Fetched stats for party id: ".concat(partyId, " successfully"));
                // Vérifiez si des statistiques ont été trouvées
                if (!stats || stats.length === 0) {
                    return [2 /*return*/, res.status(404).json({ error: "No stats found for this party ID" })];
                }
                res.json(stats);
                return [3 /*break*/, 4];
            case 3:
                err_12 = _a.sent();
                console.log("Error fetching stats for party id: ".concat(partyId, ": "), err_12);
                res.status(500).json({ error: "An error occurred while fetching stats" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/tournaments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var year, tournaments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = req.body.year;
                return [4 /*yield*/, prisma.tournament.create({
                        data: { year: year },
                    })];
            case 1:
                tournaments = _a.sent();
                res.json(tournaments);
                return [2 /*return*/];
        }
    });
}); });
app.post("/tournaments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var year, tournaments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                year = req.body.year;
                return [4 /*yield*/, prisma.tournament.create({
                        data: { year: year },
                    })];
            case 1:
                tournaments = _a.sent();
                res.json(tournaments);
                return [2 /*return*/];
        }
    });
}); });
app.post("/parties", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, date, tournamentId, parties;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, date = _a.date, tournamentId = _a.tournamentId;
                return [4 /*yield*/, prisma.party.create({
                        data: { date: date, tournamentId: tournamentId },
                    })];
            case 1:
                parties = _b.sent();
                res.json(parties);
                return [2 /*return*/];
        }
    });
}); });
app.post("/players", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, phoneNumber, player, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                name_1 = req.body.name;
                phoneNumber = req.body.phoneNumber;
                // Validate that a name was provided
                if (!name_1 || !phoneNumber) {
                    return [2 /*return*/, res.status(400).json({ error: "Name is required" })];
                }
                if (!phoneNumber) {
                    return [2 /*return*/, res.status(400).json({ error: "Phone is required" })];
                }
                return [4 /*yield*/, prisma.player.create({
                        data: { name: name_1, phoneNumber: phoneNumber },
                    })];
            case 1:
                player = _a.sent();
                return [2 /*return*/, res.json(player)];
            case 2:
                error_1 = _a.sent();
                console.error(error_1);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "An error occurred while creating the player" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/playerStats/start", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, players, tournamentId, currentYearTournament, actualTournamentId, tournament, newParty, newPlayerStats, _i, players_1, playerId, playerStat;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, players = _a.players, tournamentId = _a.tournamentId;
                if (!players || !Array.isArray(players) || players.length < 4) {
                    return [2 /*return*/, res.status(400).json({ error: "At least 4 players are required" })];
                }
                return [4 /*yield*/, prisma.tournament.findFirst({
                        where: {
                            year: new Date().getFullYear(),
                        },
                    })];
            case 1:
                currentYearTournament = _b.sent();
                if (!!currentYearTournament) return [3 /*break*/, 3];
                return [4 /*yield*/, prisma.tournament.create({
                        data: {
                            year: new Date().getFullYear(),
                        },
                    })];
            case 2:
                currentYearTournament = _b.sent();
                _b.label = 3;
            case 3:
                actualTournamentId = currentYearTournament.id;
                return [4 /*yield*/, prisma.tournament.findUnique({
                        where: { id: actualTournamentId },
                    })];
            case 4:
                tournament = _b.sent();
                if (!tournament) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "The specified tournament does not exist" })];
                }
                return [4 /*yield*/, prisma.party.create({
                        data: {
                            date: new Date(),
                            tournamentId: actualTournamentId,
                        },
                    })];
            case 5:
                newParty = _b.sent();
                newPlayerStats = [];
                _i = 0, players_1 = players;
                _b.label = 6;
            case 6:
                if (!(_i < players_1.length)) return [3 /*break*/, 9];
                playerId = players_1[_i];
                return [4 /*yield*/, prisma.playerStats.create({
                        data: {
                            partyId: newParty.id,
                            playerId: playerId,
                            points: 0,
                            buyin: 1,
                            rebuys: 0,
                            totalCost: 5,
                            position: 0,
                            outAt: null,
                        },
                    })];
            case 7:
                playerStat = _b.sent();
                newPlayerStats.push(playerStat);
                _b.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [2 /*return*/, res.json({
                    message: "New game started successfully",
                    playerStats: newPlayerStats,
                })];
        }
    });
}); });
// Assume each player provides playerId, points, and rebuys
app.post("/playerStats", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, partyId, playerId, points, rebuys, buyin, position, outAt, kills, totalCost, game, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, partyId = _a.partyId, playerId = _a.playerId, points = _a.points, rebuys = _a.rebuys, buyin = _a.buyin, position = _a.position, outAt = _a.outAt, kills = _a.kills;
                if (!partyId || !playerId || points === undefined || rebuys === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: "All fields are required" })];
                }
                totalCost = buyin * 1;
                return [4 /*yield*/, prisma.playerStats.create({
                        data: {
                            partyId: partyId,
                            playerId: playerId,
                            points: points,
                            rebuys: rebuys,
                            buyin: buyin,
                            totalCost: totalCost,
                            position: position,
                            outAt: outAt,
                            kills: kills,
                        },
                        include: {
                            party: true, // include party data
                            player: true, // include player data
                        },
                    })];
            case 1:
                game = _b.sent();
                res.json(game);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                console.error(error_2);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "An error occurred while creating the game" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post("/gameResults", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var games, updatedGames, _i, games_1, game, id, gameData, updatedGame, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                games = req.body;
                updatedGames = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                _i = 0, games_1 = games;
                _a.label = 2;
            case 2:
                if (!(_i < games_1.length)) return [3 /*break*/, 5];
                game = games_1[_i];
                id = game.id, gameData = __rest(game, ["id"]);
                return [4 /*yield*/, prisma.playerStats.update({
                        where: { id: id }, // find the game with the given id
                        data: gameData, // update the game with the rest of the game data
                    })];
            case 3:
                updatedGame = _a.sent();
                updatedGames.push(updatedGame);
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                res.json({ updatedGames: updatedGames });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                console.error(error_3);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "An error occurred while saving the game results" })];
            case 7: return [2 /*return*/];
        }
    });
}); });
app.put("/gamesResults/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameId, gameData, updatedGame, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                gameId = parseInt(req.params.id, 10);
                if (isNaN(gameId)) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid game ID" })];
                }
                gameData = req.body;
                console.log("Received game data:", req.body);
                return [4 /*yield*/, prisma.playerStats.update({
                        where: { id: gameId },
                        data: gameData,
                    })];
            case 1:
                updatedGame = _a.sent();
                console.log("Updated game:", updatedGame);
                res.json(updatedGame);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error(error_4);
                return [2 /*return*/, res
                        .status(500)
                        .json({ error: "An error occurred while updating the game result" })];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.put("/updateMultipleGamesResults", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var gameUpdates, updatedGames, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                gameUpdates = req.body;
                return [4 /*yield*/, Promise.all(gameUpdates.map(function (update) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.playerStats.update({
                                        where: { id: update.id },
                                        data: update.data,
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); }))];
            case 1:
                updatedGames = _a.sent();
                res.json({ updatedGames: updatedGames });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error(error_5);
                res.status(500).json({ error: "An error occurred while updating the game results" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// sais pas comment ça fonctionne
app.put("/playerStats/eliminate", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, playerId, eliminatedById, partyId, playerStatRecord, updatedStats;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Request received at /playerStats/eliminate");
                _a = req.body, playerId = _a.playerId, eliminatedById = _a.eliminatedById, partyId = _a.partyId;
                if (!playerId) {
                    return [2 /*return*/, res.status(400).json({ error: "Player ID is required" })];
                }
                return [4 /*yield*/, prisma.playerStats.findFirst({
                        where: {
                            playerId: playerId,
                            partyId: partyId,
                        },
                    })];
            case 1:
                playerStatRecord = _b.sent();
                if (!playerStatRecord) {
                    return [2 /*return*/, res
                            .status(404)
                            .json({ error: "PlayerStats record with ID ".concat(playerId, " not found") })];
                }
                return [4 /*yield*/, prisma.$transaction(function (prisma) { return __awaiter(void 0, void 0, void 0, function () {
                        var updatedPlayerStat, killerStats;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, prisma.playerStats.update({
                                        where: { id: playerStatRecord.id },
                                        data: { outAt: new Date() },
                                    })];
                                case 1:
                                    updatedPlayerStat = _a.sent();
                                    if (!eliminatedById) return [3 /*break*/, 4];
                                    return [4 /*yield*/, prisma.playerStats.findFirst({
                                            where: {
                                                playerId: eliminatedById,
                                                // Add more conditions if necessary, e.g. partyId
                                            },
                                        })];
                                case 2:
                                    killerStats = _a.sent();
                                    if (!killerStats) {
                                        throw new Error("Killer stats not found");
                                    }
                                    return [4 /*yield*/, prisma.playerStats.update({
                                            where: {
                                                id: killerStats.id,
                                            },
                                            data: {
                                                kills: killerStats.kills + 1,
                                            },
                                        })];
                                case 3:
                                    _a.sent();
                                    _a.label = 4;
                                case 4: return [2 /*return*/, updatedPlayerStat];
                            }
                        });
                    }); })];
            case 2:
                updatedStats = _b.sent();
                res.json({ message: "Player stats updated successfully", updatedStats: updatedStats });
                return [2 /*return*/];
        }
    });
}); });
app.put("/playerStats/out/:playerId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var playerId, updatedPlayerStat, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                playerId = req.params.playerId;
                if (!playerId) {
                    return [2 /*return*/, res.status(400).json({ error: "Player ID is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prisma.playerStats.update({
                        where: { id: Number(playerId) },
                        data: { outAt: new Date() },
                    })];
            case 2:
                updatedPlayerStat = _a.sent();
                return [2 /*return*/, res.json({
                        message: "Player knocked out successfully",
                        updatedPlayerStat: updatedPlayerStat,
                    })];
            case 3:
                error_6 = _a.sent();
                return [2 /*return*/, res.status(400).json({ error: "Error knocking out player" })];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete a specific party by its ID
app.delete("/parties/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, err_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                // First delete related PlayerStats
                return [4 /*yield*/, prisma.playerStats.deleteMany({
                        where: { partyId: Number(id) },
                    })];
            case 1:
                // First delete related PlayerStats
                _a.sent();
                // Then delete the Party
                return [4 /*yield*/, prisma.party.delete({
                        where: { id: Number(id) },
                    })];
            case 2:
                // Then delete the Party
                _a.sent();
                res.status(204).send();
                return [3 /*break*/, 4];
            case 3:
                err_13 = _a.sent();
                // Pass the error to the error-handling middleware
                next(err_13);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res
        .status(err.status || 500)
        .json({ error: err.message || "Internal Server Error" });
});
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
    return console.log("Server is running on https://bourlypokertour.fr :".concat(port));
});
process.on("SIGINT", function () {
    server.close(function () {
        prisma.$disconnect();
        console.log("Server closed.");
    });
});
