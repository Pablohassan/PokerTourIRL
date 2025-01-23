import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "../lib/utils";
const EditGameStateModal = ({ isOpen, onClose, games, selectedPlayers, players, onUpdateStats, }) => {
    const [editedGames, setEditedGames] = React.useState(games);
    // Reset edited games when modal is opened with new games
    useEffect(() => {
        if (isOpen) {
            setEditedGames(games);
        }
    }, [isOpen, games]);
    const handleIncrement = (playerId, field) => {
        setEditedGames(prevGames => prevGames.map(game => game.playerId === playerId
            ? { ...game, [field]: (game[field] || 0) + 1 }
            : game));
    };
    const handleDecrement = (playerId, field) => {
        setEditedGames(prevGames => prevGames.map(game => game.playerId === playerId && game[field] > 0
            ? { ...game, [field]: (game[field] || 0) - 1 }
            : game));
    };
    const handleToggleInGame = (playerId) => {
        setEditedGames(prevGames => prevGames.map(game => game.playerId === playerId
            ? { ...game, outAt: game.outAt ? null : new Date() }
            : game));
    };
    const handleSave = () => {
        onUpdateStats(editedGames);
        onClose();
    };
    // Sort games to show in-game players first, then out-of-game players
    const sortedGames = [...editedGames].sort((a, b) => {
        // First sort by in-game status
        if (!a.outAt && b.outAt)
            return -1;
        if (a.outAt && !b.outAt)
            return 1;
        // Then sort eliminated players by position
        if (a.outAt && b.outAt) {
            return (a.position || 0) - (b.position || 0);
        }
        return 0;
    });
    return (_jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: _jsxs(DialogContent, { className: "bg-slate-900 border-amber-400/20 max-w-5xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-2xl font-['DS-DIGI'] text-amber-400", children: "Edit Game State" }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4", children: sortedGames.map((game) => {
                        const player = selectedPlayers.find(p => p.id === game.playerId) ||
                            players.find(p => p.id === game.playerId);
                        if (!player)
                            return null;
                        return (_jsxs("div", { className: cn("p-4 rounded-lg", "border border-amber-400/20", "bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95", game.outAt ? "opacity-75" : "opacity-100"), children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-['DS-DIGI'] text-amber-400", children: player?.name }), game.outAt && (_jsxs("span", { className: "text-red-400 text-sm", children: ["Position: ", game.position || 'N/A'] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-amber-400/80", children: "Recaves" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleDecrement(game.playerId, 'rebuys'), className: "text-amber-400 border-amber-400/20 h-4 w-10 p-0 rounded-[5px]", children: "-" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 w-8 text-center", children: game.rebuys || 0 }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleIncrement(game.playerId, 'rebuys'), className: "text-amber-400 border-amber-400/20 h-8 w-8 p-0 rounded-xl", children: "+" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-amber-400/80", children: "Kills" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => handleDecrement(game.playerId, 'kills'), className: "text-amber-400 border-amber-400/20 h-4 w-10 p-0 rounded-[5px]", children: "-" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 w-8 text-center", children: game.kills || 0 }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleIncrement(game.playerId, 'kills'), className: "text-amber-400 border-amber-400/20 h-8 w-8 p-0 rounded-xl", children: "+" })] })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => handleToggleInGame(game.playerId), className: cn("w-full", game.outAt
                                                ? "text-green-400 border-green-400/20 rounded-[5px]"
                                                : "text-red-400 border-red-400/20 rounded-[5px]"), children: game.outAt ? "Retour au jeu" : "Marquer comme sorti" })] })] }, game.playerId));
                    }) }), _jsxs("div", { className: "mt-6 flex justify-end gap-2", children: [_jsx(Button, { variant: "outline", onClick: onClose, className: "text-red-400 border-red-400/20", children: "Cancel" }), _jsx(Button, { variant: "outline", onClick: handleSave, className: "text-amber-400 border-amber-400/20", children: "Save Changes" })] })] }) }));
};
export default EditGameStateModal;
