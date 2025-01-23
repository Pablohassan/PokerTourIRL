import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { cn } from "../lib/utils";
import ConfirmDialog from "./ui/confirm-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
    const [selectedKiller, setSelectedKiller] = React.useState(null);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const handleKillerClick = (killerId) => {
        setSelectedKiller(killerId);
        setShowConfirm(true);
    };
    const handleConfirm = () => {
        if (selectedKiller !== null) {
            handlePlayerKillSelection(selectedKiller);
            setShowConfirm(false);
            setSelectedKiller(null);
        }
    };
    const selectedKillerName = selectedKiller
        ? currentlyPlayingPlayers.find(p => p.id === selectedKiller)?.name
        : '';
    const eliminatedPlayerName = affectedPlayer
        ? currentlyPlayingPlayers.find(p => p.id === affectedPlayer.playerId)?.name
        : '';
    return (_jsxs(_Fragment, { children: [_jsx(Dialog, { open: killer, modal: true, children: _jsxs(DialogContent, { className: cn("bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95", "border border-amber-400/20", "shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]", "backdrop-blur-md", "max-w-2xl", "overflow-hidden"), children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-2xl font-['DS-DIGI'] text-amber-400 text-center", children: "Select the Killer" }) }), _jsxs("div", { className: "space-y-6 p-1", children: [affectedPlayer && (_jsxs("div", { className: "text-center text-lg text-amber-400/80 font-['DS-DIGI']", children: ["Who eliminated", " ", _jsx("span", { className: "text-amber-400 font-bold", children: eliminatedPlayerName }), "?"] })), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: availableKillers.map((player) => {
                                        const playerGame = games.find((game) => game.playerId === player.id);
                                        if (!playerGame)
                                            return null;
                                        const isSelected = selectedKiller === player.id;
                                        return (_jsxs("button", { onClick: () => handleKillerClick(player.id), className: cn("relative group", "h-auto py-4 px-3", "bg-gradient-to-b from-slate-800/90 to-slate-900/90", "border", isSelected
                                                ? "border-amber-400"
                                                : "border-amber-400/20 hover:border-amber-400/40", "rounded-xl", "transition-all duration-200", "overflow-hidden", isSelected
                                                ? "shadow-[0_0_25px_-5px_rgba(245,158,11,0.4)]"
                                                : "shadow-[0_0_15px_-5px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]"), children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "font-['DS-DIGI'] text-xl text-amber-400 font-bold", children: player.name }), _jsxs("div", { className: "font-['DS-DIGI'] text-sm text-amber-400/70", children: ["Kills: ", playerGame.kills] })] }), _jsx("div", { className: cn("absolute inset-0", "bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0", "translate-x-[-100%] group-hover:translate-x-[100%]", "transition-transform duration-700", "pointer-events-none") })] }, player.id));
                                    }) })] })] }) }), _jsx(ConfirmDialog, { isOpen: showConfirm, onClose: () => setShowConfirm(false), onConfirm: handleConfirm, title: "Confirm Killer Selection", description: `Are you sure you want to select ${selectedKillerName} as the killer for eliminating ${eliminatedPlayerName}?`, confirmText: "Yes, Confirm", cancelText: "No, Cancel", variant: "warning" })] }));
};
export default KillerSelectionModal;
