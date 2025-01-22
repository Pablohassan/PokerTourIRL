import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
const GameTimer = ({ middleStack, totalPot, formatTime, timeLeft, smallBlind, bigBlind, 
// handleGameEnd,
isPaused, setIsPaused, ante }) => {
    return (_jsx(Card, { className: cn("w-full max-w-full mx-auto", "bg-gradient-to-b from-slate-950/90 to-slate-800/95 backdrop-blur-md border-amber-400/20", "rounded-2xl", "shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]", "overflow-hidden", "min-h-[200px]"), children: _jsxs(CardContent, { className: "p-2 sm:p-3 rounded-2xl", children: [_jsxs("div", { className: "grid grid-cols-2 [&>*:first-child]:col-span-2 gap-2 sm:gap-3 [&>*:first-child]:min-[900px]:col-span-1 min-[900px]:grid-cols-3", children: [_jsxs("div", { className: cn("rounded-xl", "flex flex-col justify-center items-center", "bg-slate-950/90 p-2 sm:p-3", "border border-amber-400/20", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "min-h-[120px] sm:min-h-[160px]"), children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl mb-1", children: "Time Left" }), _jsx("span", { className: cn("font-['DS-DIGI'] text-amber-400", "text-4xl sm:text-6xl min-[900px]:text-7xl", "tabular-nums tracking-wider"), children: formatTime(timeLeft) })] }), _jsx("div", { className: cn("flex flex-col justify-between", "bg-slate-950/90 rounded-xl p-2 sm:p-3", "border border-amber-400/20", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "min-h-[120px] sm:min-h-[160px]"), children: _jsxs("div", { className: "space-y-1 sm:space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl", children: "Small" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: smallBlind })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl", children: "Big" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: bigBlind })] }), _jsx("div", { className: "h-px bg-amber-400/20 my-1 sm:my-2" }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl", children: "Ante" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: ante })] })] }) }), _jsx("div", { className: cn("flex flex-col justify-between", "bg-slate-950/90 rounded-xl p-2 sm:p-3", "border border-amber-400/20", "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]", "min-h-[120px] sm:min-h-[160px]"), children: _jsxs("div", { className: "space-y-2 sm:space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl", children: "Pot" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: totalPot })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl", children: "M-Stack" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl", children: middleStack })] })] }) })] }), _jsx("div", { className: "flex justify-center gap-2 mt-2 pt-2 border-t border-amber-400/20", children: _jsx(Button, { variant: "secondary", size: "sm", onClick: () => setIsPaused(!isPaused), className: cn("font-['DS-DIGI'] text-base sm:text-lg", "px-4 sm:px-6", "h-8 sm:h-10", "rounded-xl", "bg-amber-500/80 hover:bg-amber-500/20", "text-slate-900 hover:text-slate-700", "border border-amber-400/20"), children: isPaused ? 'Resume' : 'Pause' }) })] }) }));
};
export default React.memo(GameTimer);
