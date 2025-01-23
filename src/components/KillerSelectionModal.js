import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
const KillerSelectionModal = ({ killer, games, currentlyPlayingPlayers, rebuyPlayerId, playerOutGame, handlePlayerKillSelection, }) => {
    if (!killer)
        return null;
    console.log('KillerSelectionModal render:', {
        killer,
        playersCount: currentlyPlayingPlayers.length,
        rebuyPlayerId,
        playerOutGame
    });
    // Get the player being acted upon (either rebuy or elimination)
    const affectedPlayer = games.find(game => game.playerId === (rebuyPlayerId || playerOutGame));
    // Filter out the affected player from the killer selection list
    const availableKillers = currentlyPlayingPlayers.filter(player => player.id !== (rebuyPlayerId || playerOutGame));
    return (_jsx(Dialog, { open: killer, onOpenChange: () => { }, children: _jsxs(DialogContent, { className: cn("bg-zinc-900", "border-2 border-blue-500", "backdrop-blur-md", "shadow-lg shadow-black/25", "max-w-[90vw] sm:max-w-[500px]", "p-6"), children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: cn("font-['DS-DIGI']", "text-3xl sm:text-4xl", "text-center", "text-blue-50", "tracking-wider", "font-bold"), children: "Select the Killer" }), affectedPlayer && (_jsxs("div", { className: cn("text-center", "text-blue-200/90", "font-['DS-DIGI']", "text-xl", "leading-relaxed", "mt-4"), children: ["Who eliminated", " ", _jsx("span", { className: "font-bold", children: currentlyPlayingPlayers.find(p => p.id === affectedPlayer.playerId)?.name }), "?"] }))] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8", children: availableKillers.map((player) => {
                        const playerGame = games.find((game) => game.playerId === player.id);
                        if (!playerGame)
                            return null;
                        return (_jsx(Button, { onClick: () => handlePlayerKillSelection(player.id), className: cn("bg-gradient-to-br from-blue-500 to-blue-600", "hover:from-blue-600 hover:to-blue-700", "text-white font-semibold", "shadow-[0_0_15px_rgba(59,130,246,0.3)]", "hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]", "hover:scale-110", "font-['DS-DIGI']", "text-lg", "px-6 py-4", "transition-all duration-200", "flex flex-col items-center gap-2", "border-0"), children: _jsx("span", { className: "font-bold", children: player.name }) }, player.id));
                    }) })] }) }));
};
export default KillerSelectionModal;
