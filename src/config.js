const isDevelopment = process.env.NODE_ENV === "development";
export const API_BASE_URL = isDevelopment ? "http://localhost:3000" : "/api";
export const API_ENDPOINTS = {
    GAME_STATE: `${API_BASE_URL}/gameState`,
    TOURNAMENTS: `${API_BASE_URL}/tournaments`,
    PARTIES: `${API_BASE_URL}/parties`,
    PLAYERS: `${API_BASE_URL}/player`,
    PLAYER_STATS: `${API_BASE_URL}/playerstats`,
    SEASON_POINTS: (playerId, tournamentId) => `${API_BASE_URL}/season-points/${playerId}/${tournamentId}`,
    PLAYER_STATS_BY_ID: (playerId, tournamentId) => `${API_BASE_URL}/player-stats/${playerId}/${tournamentId}`,
};
export const API_CONFIG = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
};
export default API_ENDPOINTS;
