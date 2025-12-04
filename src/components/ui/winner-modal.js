import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { calculateGains, calculatePlayerCost } from "../../utils/gainsCalculator";
const WinnerModal = ({ isOpen, onClose, winner, games, pot, initialPlayerCount, selectedPlayers }) => {
    const [countdown, setCountdown] = useState(30);
    const totalPlayers = useMemo(() => initialPlayerCount || games.length || selectedPlayers.length, [initialPlayerCount, games.length, selectedPlayers.length]);
    const payingPositions = useMemo(() => {
        if (totalPlayers <= 6)
            return [1, 2];
        if (totalPlayers === 7)
            return [1, 2, 3];
        return [1, 2, 3, 4];
    }, [totalPlayers]);
    const getPlayerName = (playerId) => {
        if (!playerId)
            return "";
        const inSelected = selectedPlayers.find(p => p.id === playerId);
        if (inSelected)
            return inSelected.name;
        const inGame = games.find(g => g.playerId === playerId);
        return inGame?.playerName || "";
    };
    const payoutList = useMemo(() => {
        return payingPositions.map(position => {
            const gameEntry = games.find(g => g.position === position) || games.find(g => g.playerId === winner?.id && !g.position && position === 1);
            if (!gameEntry && position === 1 && winner) {
                const cost = calculatePlayerCost(0);
                const net = calculateGains(position, totalPlayers, pot, cost);
                const payout = net + cost;
                return {
                    position,
                    name: winner.name,
                    payout,
                    net
                };
            }
            if (!gameEntry)
                return null;
            const name = getPlayerName(gameEntry.playerId) || winner?.name || "";
            const rebuys = gameEntry.rebuys || 0;
            const cost = calculatePlayerCost(rebuys);
            const net = calculateGains(position, totalPlayers, pot, cost);
            const payout = net + cost;
            return {
                position,
                name: name || `Joueur ${position}`,
                payout,
                net
            };
        }).filter(Boolean);
    }, [payingPositions, games, winner, totalPlayers, pot, selectedPlayers]);
    useEffect(() => {
        if (isOpen) {
            setCountdown(30);
            const interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);
    if (!isOpen)
        return null;
    return createPortal(_jsxs("div", { className: "fixed inset-0 z-[9999] flex items-center justify-center", children: [_jsx("div", { className: "fixed inset-0 bg-black/80", onClick: onClose }), _jsxs("div", { className: cn("bg-gradient-to-br from-amber-900 to-yellow-800", "border-4 border-amber-400", "backdrop-blur-md", "shadow-2xl shadow-amber-400/25", "max-w-[90vw] sm:max-w-[600px]", "p-8", "relative", "overflow-hidden", "rounded-lg", "z-[10000]"), children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-400/10 to-yellow-600/10" }), _jsx("div", { className: "absolute top-4 left-4 w-16 h-16 bg-amber-400/20 rounded-full blur-xl" }), _jsx("div", { className: "absolute bottom-4 right-4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl" }), _jsxs("div", { className: "space-y-6 relative z-10", children: [_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "text-6xl", children: "\uD83C\uDFC6" }) }), _jsx("h1", { className: cn("font-['DS-DIGI']", "text-4xl sm:text-5xl", "text-center", "text-amber-100", "tracking-wider", "font-bold", "drop-shadow-lg", "animate-pulse"), children: "F\u00C9LICITATIONS !" }), winner && (_jsxs("p", { className: cn("text-center", "text-amber-200", "font-['DS-DIGI']", "text-2xl sm:text-3xl", "leading-relaxed", "font-semibold", "drop-shadow-md"), children: [winner.name, " remporte la victoire ! \uD83C\uDF89"] })), payoutList.length > 0 && (_jsxs("div", { className: "mt-4 space-y-2", children: [_jsxs("div", { className: "text-center text-amber-100 font-['DS-DIGI'] text-xl", children: ["Partage du pot (", pot, "\u20AC)"] }), _jsx("div", { className: "bg-amber-900/30 border border-amber-400/30 rounded-lg p-3 space-y-2", children: payoutList.map(({ position, name, payout, net }) => (_jsxs("div", { className: "flex justify-between items-baseline text-amber-100 font-['DS-DIGI'] text-lg", children: [_jsxs("span", { children: [position, "e : ", name] }), _jsxs("div", { className: "text-right leading-tight", children: [_jsxs("div", { className: "font-bold", children: ["+", payout.toFixed(2), "\u20AC"] }), _jsxs("div", { className: "text-xs text-amber-200/70", children: ["net: ", net >= 0 ? '+' : '', net.toFixed(2), "\u20AC"] })] })] }, position))) })] })), _jsx("p", { className: cn("text-center", "text-amber-300/90", "font-['DS-DIGI']", "text-lg", "leading-relaxed", "mt-4"), children: _jsxs("span", { className: "text-amber-200 font-bold text-xl mt-2 block", children: ["Redirection automatique dans ", countdown, " secondes..."] }) })] }), _jsx("div", { className: "flex justify-center mt-8 relative z-10", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-full border-4 border-amber-400/30 flex items-center justify-center", children: _jsx("span", { className: "text-3xl font-['DS-DIGI'] text-amber-200 font-bold", children: countdown }) }), _jsx("div", { className: "absolute inset-0 rounded-full border-4 border-amber-400 transition-all duration-1000 ease-linear", style: {
                                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(2 * Math.PI * (30 - countdown) / 30 - Math.PI / 2)}% ${50 + 50 * Math.sin(2 * Math.PI * (30 - countdown) / 30 - Math.PI / 2)}%, 50% 50%)`
                                    } })] }) })] })] }), document.body);
};
export default WinnerModal;
