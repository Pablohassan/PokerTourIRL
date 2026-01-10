import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import metaltexture from "../../public/texturemetaluse.jpg";
import { AnimatePresence, motion } from "framer-motion";
const GameTimer = ({ middleStack, totalRebuys, outPlayers, totalPot, formatTime, timeLeft, smallBlind, bigBlind, 
// handleGameEnd,
isPaused, setIsPaused, ante, socketConnected = false, socketPauseTimer, socketResumeTimer, }) => {
    const [currentOutIndex, setCurrentOutIndex] = useState(0);
    useEffect(() => {
        setCurrentOutIndex(0);
    }, [outPlayers.length]);
    useEffect(() => {
        if (outPlayers.length <= 1)
            return;
        const interval = setInterval(() => {
            setCurrentOutIndex((prev) => (prev + 1) % outPlayers.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [outPlayers.length]);
    const currentOutPlayer = outPlayers[currentOutIndex];
    const handleClick = () => {
        // Add vibration feedback (50ms)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        if (socketConnected) {
            if (isPaused) {
                socketResumeTimer?.();
            }
            else {
                socketPauseTimer?.();
            }
        }
        else {
            setIsPaused(!isPaused);
        }
    };
    return (_jsx(Card, { className: cn("w-full max-w-full mx-auto", "rounded-2xl", "border border-slate-200/80", "shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]", "overflow-hidden", "min-h-[300px]", "relative", "before:content-[''] before:absolute before:inset-0", "before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)]", "before:opacity-0 before:animate-shine before:-z-[1]", "hover:before:opacity-40"), style: {
            backgroundImage: `url(${metaltexture})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }, children: _jsxs(CardContent, { className: "p-2 sm:p-2 rounded-2xl", children: [_jsxs("div", { className: "grid grid-cols-4 [&>*:first-child]:col-span-4 gap-2 sm:gap-3 min-[950px]:grid-cols-8 [&>*:first-child]:min-[950px]:col-span-4 [&>*:not(:first-child)]:min-[950px]:col-span-2", children: [_jsxs("div", { className: cn("rounded-xl", "flex flex-col justify-center items-center", "bg-slate-950/95 p-2 sm:p-3", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "min-h-[180px] sm:min-h-[230px]", "relative", "overflow-hidden", "before:content-['']", "before:absolute before:inset-0", "border-2 border-amber-400/20", "after:content-['']", "after:absolute after:inset-0"), children: [_jsx("div", { className: "" }), _jsxs("div", { className: "relative z-10 flex flex-col items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-3xl sm:text-3xl shadow-lg ", children: "Time Left" }), _jsx("span", { className: cn("font-['DS-DIGI'] text-amber-400/95", "text-4xl sm:text-7xl min-[900px]:text-[180px]", "text-center", "tabular-nums tracking-wider"), children: formatTime(timeLeft) })] }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" })] }), _jsx("div", { className: cn("flex flex-col justify-between", "bg-slate-950/90 rounded-xl p-2 sm:p-3", "border border-slate-200/60", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "min-h-[180px] sm:min-h-[230px]", "border-2 border-amber-400/20"), children: _jsxs("div", { className: "space-y-1 sm:space-y-2 ", children: [_jsxs("div", { className: "flex justify-between items-center ", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-xl sm:text-3xl ", children: "Small" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400/95 text-2xl sm:text-5xl", children: smallBlind })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-xl sm:text-3xl", children: "Big" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400/95 text-2xl sm:text-5xl", children: bigBlind })] }), _jsx("div", { className: "h-px bg-amber-400/20 my-1 sm:my-2" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-xl sm:text-3xl", children: "Ante" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400/95 text-2xl sm:text-5xl", children: ante })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-xl sm:text-2xl", children: "M-Stack" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-5xl", children: middleStack })] })] }) }), _jsx("div", { className: cn("flex flex-col justify-between", "bg-slate-950/90 rounded-xl p-2 sm:p-3", "border-2 border-amber-400/20", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "min-h-[190px] sm:min-h-[230px]", "min-h-[180px] sm:min-h-[230px]"), children: _jsxs("div", { className: "space-y-2 sm:space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-xl sm:text-2xl", children: "Pot" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: totalPot })] }), _jsx("div", { className: "h-px bg-amber-400/20 my-1 sm:my-2" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/90 text-xl sm:text-2xl", children: "Total Rebuys" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: totalRebuys })] }), _jsx("div", { className: "h-px bg-amber-400/20 my-1 sm:my-2" }), _jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-xs sm:text-sm uppercase tracking-[0.25em]", children: "Joueurs \u00E9limin\u00E9s" }), _jsx("div", { className: "h-14 sm:h-16 w-full overflow-hidden rounded-lg border border-amber-400/10 bg-slate-900/70", children: _jsx("div", { className: "h-full flex items-center justify-center px-3", children: _jsx(AnimatePresence, { mode: "wait", initial: false, children: currentOutPlayer ? (_jsxs(motion.div, { initial: { x: "100%", opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: "-100%", opacity: 0 }, transition: { duration: 0.6, ease: "easeInOut" }, className: "flex items-center gap-3 text-amber-300", children: [_jsx("span", { className: "font-['DS-DIGI'] text-xl sm:text-2xl", children: currentOutPlayer.name || currentOutPlayer.playerName || 'Player' }), _jsx("span", { className: "text-sm sm:text-base text-amber-200/80", children: currentOutPlayer.position ? `#${currentOutPlayer.position}` : 'Out' })] }, `${currentOutPlayer.id || currentOutPlayer.playerId}-out`)) : (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.3 }, className: "text-amber-200/60 text-sm sm:text-base font-['DS-DIGI']", children: "Aucun joueur \u00E9limin\u00E9" }, "no-out-players")) }) }) })] })] }) })] }), _jsxs("div", { className: "flex justify-center items-center mt-1 mb-4 pt-2 border-t border-slate-100/30 relative", children: [_jsx("div", { className: "absolute left-0 ml-4 sm:ml-2", children: _jsx("div", { className: "font-['font-custom'] text-slate-950/30 text-shadow-lg text-6xl sm:text-7xl", style: { textShadow: '2 px 2px 2px rgba(255, 255, 255, 0.5)' }, children: "BOURLY POKER" }) }), _jsx(Button, { variant: "secondary", size: "sm", onClick: handleClick, className: cn("font-['DS-DIGI'] text-lg sm:text-2xl", "translate-y-[-5px]", "z-10", "px-7 sm:px-10", "py-7 sm:py-8", "h-12 sm:h-14", "rounded-[80px]", "relative overflow-hidden", "bg-gradient-to-br from-amber-400/90 to-amber-700/80", "text-shadow-[0_2px_2px_rgba(0,0,0,0.5)]", "shadow-[0_4px_12px_rgba(245,158,11,0.4)]", "transform transition-all duration-1000 ease-in-out", "border-2 border-amber-950/50", "before:content-[''] before:absolute before:inset-0", "before:bg-gradient-to-r before:from-white/20 before:to-transparent", "before:opacity-40 before:-rotate-45 before:translate-x-[-30%]", "hover:before:animate-shine", "hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-700", "focus:!bg-gradient-to-br focus:!from-amber-400/90 focus:!to-amber-600", "active:scale-95 focus:outline-none"), children: _jsx("span", { className: "relative z-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]", children: isPaused ? 'Resume' : 'Pause' }) })] })] }) }));
};
export default React.memo(GameTimer);
