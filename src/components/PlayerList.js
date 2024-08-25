import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { CardPlayer } from "./CardPlayer";
const PlayerList = ({ players, games, handleRebuy, handleOutOfGame }) => {
    console.log('PlayerList players:', players);
    console.log('PlayerList games:', games);
    return (_jsx("div", { style: { display: "flex", flexDirection: "row", flexWrap: "wrap" }, children: players.map((player) => {
            const gameForPlayer = games.find((game) => game.playerId === player.id);
            if (!gameForPlayer) {
                console.error(`No game data found for player ${player.name}`);
                return (_jsxs("div", { children: ["Erreur: Pas de jeu pour ", player.name] }, player.id));
            }
            return (_jsx("div", { style: { display: "flex", flexDirection: "column" }, children: _jsx("div", { className: "p-1", children: _jsx(CardPlayer, { playername: player?.name ?? "none", recave: gameForPlayer.rebuys, kill: gameForPlayer.kills, rebuy: () => handleRebuy(gameForPlayer.playerId), outOfGame: () => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById) }, player.id) }) }, player.id));
        }) }));
};
export default PlayerList;
