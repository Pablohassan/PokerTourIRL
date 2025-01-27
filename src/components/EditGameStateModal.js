import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "../lib/utils";
const EditGameStateModal = ({ isOpen, onClose, games, selectedPlayers, players, onUpdateStats, blindIndex, setBlindIndex, timeLeft, setTimeLeft, smallBlind, bigBlind, ante, setSmallBlind, setBigBlind, setAnte, isPaused, setIsPaused, }) => {
    const [editedGames, setEditedGames] = React.useState(games);
    const [editedTimeLeft, setEditedTimeLeft] = React.useState(Math.floor(timeLeft / 60));
    const wasPausedRef = React.useRef(isPaused);
    const blinds = [
        { small: 10, big: 20, ante: 0 },
        { small: 25, big: 50, ante: 0 },
        { small: 50, big: 100, ante: 0 },
        { small: 100, big: 200, ante: 0 },
        { small: 150, big: 300, ante: 0 },
        { small: 200, big: 400, ante: 10 },
        { small: 250, big: 500, ante: 10 },
        { small: 300, big: 600, ante: 25 },
        { small: 400, big: 800, ante: 25 },
        { small: 500, big: 1000, ante: 50 },
        { small: 600, big: 1200, ante: 50 },
        { small: 700, big: 1400, ante: 100 },
        { small: 800, big: 1600, ante: 100 },
        { small: 900, big: 1800, ante: 200 },
        { small: 1000, big: 2000, ante: 200 },
        { small: 1200, big: 2400, ante: 300 },
        { small: 1400, big: 2800, ante: 300 },
        { small: 1600, big: 3200, ante: 400 },
        { small: 1800, big: 3600, ante: 400 },
        { small: 2000, big: 4000, ante: 500 },
        { small: 2200, big: 4400, ante: 500 },
        { small: 2500, big: 5000, ante: 500 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3500, big: 7000, ante: 1000 },
        { small: 4000, big: 8000, ante: 2000 },
        { small: 5000, big: 10000, ante: 2000 },
        { small: 6000, big: 12000, ante: 3000 },
        { small: 7000, big: 14000, ante: 3000 },
        { small: 8000, big: 16000, ante: 4000 },
        { small: 9000, big: 18000, ante: 4000 },
        { small: 10000, big: 20000, ante: 5000 },
    ];
    // Pause game when modal opens, store previous pause state
    useEffect(() => {
        if (isOpen) {
            wasPausedRef.current = isPaused;
            setIsPaused(true);
            setEditedGames(games);
            setEditedTimeLeft(Math.floor(timeLeft / 60));
        }
    }, [isOpen, games, timeLeft, isPaused, setIsPaused]);
    const handleClose = () => {
        // Only resume if game wasn't paused before
        if (!wasPausedRef.current) {
            setIsPaused(false);
        }
        onClose();
    };
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
        // Update time left only
        setTimeLeft(editedTimeLeft * 60);
        onUpdateStats(editedGames);
        // Only resume if game wasn't paused before
        if (!wasPausedRef.current) {
            setIsPaused(false);
        }
        onClose();
    };
    const handlePreviousBlind = () => {
        if (blindIndex > 0) {
            const newIndex = blindIndex - 1;
            const { small, big, ante } = blinds[newIndex];
            setBlindIndex(newIndex);
            setSmallBlind(small);
            setBigBlind(big);
            setAnte(ante);
        }
    };
    const handleNextBlind = () => {
        if (blindIndex < blinds.length - 1) {
            const newIndex = blindIndex + 1;
            const { small, big, ante } = blinds[newIndex];
            setBlindIndex(newIndex);
            setSmallBlind(small);
            setBigBlind(big);
            setAnte(ante);
        }
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
    return (_jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && handleClose(), children: _jsxs(DialogContent, { className: "bg-slate-900 border-amber-400/20 max-w-5xl max-h-[90vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { className: "text-2xl font-['DS-DIGI'] text-amber-400", children: "Edit Game State" }) }), _jsx("div", { className: "mb-6 p-4 rounded-lg border border-amber-400/20 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-['DS-DIGI'] text-amber-400", children: "Timer Settings" }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "text-amber-400/80 block mb-2", children: "Time Left (minutes)" }), _jsx("input", { type: "number", value: editedTimeLeft, onChange: (e) => setEditedTimeLeft(Math.max(0, parseInt(e.target.value) || 0)), className: "w-full bg-slate-800 text-amber-400 border border-amber-400/20 rounded p-2" })] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-['DS-DIGI'] text-amber-400", children: "Blind Controls" }), _jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsx(Button, { variant: "outline", onClick: handlePreviousBlind, disabled: blindIndex === 0, className: "text-amber-400 border-amber-400/20", children: "Previous Level" }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-amber-400/80", children: "Current Level" }), _jsx("div", { className: "text-amber-400 text-lg", children: blindIndex + 1 })] }), _jsx(Button, { variant: "outline", onClick: handleNextBlind, disabled: blindIndex >= blinds.length - 1, className: "text-amber-400 border-amber-400/20", children: "Next Level" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mt-2", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-amber-400/80", children: "Small" }), _jsx("div", { className: "text-amber-400", children: smallBlind })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-amber-400/80", children: "Big" }), _jsx("div", { className: "text-amber-400", children: bigBlind })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-amber-400/80", children: "Ante" }), _jsx("div", { className: "text-amber-400", children: ante })] })] })] })] }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4", children: sortedGames.map((game) => {
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
