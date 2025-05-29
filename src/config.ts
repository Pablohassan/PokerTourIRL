const isDevelopment = process.env.NODE_ENV === "development";

export const API_BASE_URL = isDevelopment ? "http://localhost:3000" : "/api";

export const API_ENDPOINTS = {
  GAME_STATE: "/gameState",
  TOURNAMENTS: "/tournaments",
  PARTIES: "/parties",
  PLAYERS: "/player",
  PLAYER_STATS: "/playerstats",
  SEASON_POINTS: (playerId: number, tournamentId: number) =>
    `/season-points/${playerId}/${tournamentId}`,
  PLAYER_STATS_BY_ID: (playerId: number, tournamentId: number) =>
    `/player-stats/${playerId}/${tournamentId}`,
};

export const API_CONFIG = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
};

export default API_ENDPOINTS;
