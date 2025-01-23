import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { CardPlayer } from "./CardPlayer";
import { cn } from "../lib/utils";
const PlayerList = ({ players, games, handleRebuy, handleOutOfGame }) => {
    return (_jsx("div", { className: cn("w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8", "gap-1 ", "rounded-lg border border-amber-400/10", "shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)]"), children: players.map((player) => {
            const gameForPlayer = games.find((game) => game.playerId === player.id);
            if (!gameForPlayer) {
                console.error(`No game data found for player ${player.name}`);
                return (_jsxs("div", { className: cn("p-2 rounded-lg", "bg-red-950/50 backdrop-blur-md", "border border-red-400/20", "text-red-400 text-sm", "shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"), children: ["Erreur: Pas de jeu pour ", player.name] }, player.id));
            }
            return (_jsx("div", { className: "flex flex-col", children: _jsx(CardPlayer, { playername: player?.name ?? "none", recave: gameForPlayer.rebuys, kill: gameForPlayer.kills, rebuy: () => handleRebuy(gameForPlayer.playerId), outOfGame: () => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById) }, player.id) }, player.id));
        }) }));
};
export default PlayerList;
