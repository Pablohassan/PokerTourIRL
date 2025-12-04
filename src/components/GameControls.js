import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import BlindTimer from "./BlindTimer";
import GameTimer from "./GameTimer";
import { cn } from "../lib/utils";
const GameControls = ({ gameStarted, isPaused, timeLeft, smallBlind, bigBlind, ante, handleGameEnd, setIsPaused, pot, middleStack, totalRebuys, outPlayers, setSmallBlind, setBigBlind, setAnte, setTimeLeft, blindIndex, setBlindIndex, initialTimeLeft, }) => {
    const isUpdatingRef = useRef(false);
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    if (!gameStarted)
        return null;
    return (_jsx("div", { className: cn("w-full max-w-[1010px] min-h-[300px] mx-auto", "bg-slate-950/95 backdrop-blur-md", "border border-amber-400/10", "shadow-[0_0_35px_-5px_rgba(245,158,11,0.15)]", "rounded-2xl overflow-hidden"), children: _jsxs("div", { className: "space-y-2", children: [_jsx(BlindTimer, { gameStarted: gameStarted, isPaused: isPaused, onBlindChange: (small, big, ante) => {
                        if (isUpdatingRef.current)
                            return;
                        isUpdatingRef.current = true;
                        try {
                            setSmallBlind(small);
                            setBigBlind(big);
                            setAnte(ante);
                        }
                        finally {
                            isUpdatingRef.current = false;
                        }
                    }, onTimeChange: (time) => {
                        if (isUpdatingRef.current)
                            return;
                        setTimeLeft(time);
                    }, blindIndex: blindIndex, setBlindIndex: setBlindIndex, initialTimeLeft: initialTimeLeft, 
                    // @ts-ignore timeLeft is not used in BlindTimer
                    timeLeft: timeLeft, setTimeLeft: setTimeLeft }), _jsx(GameTimer, { timeLeft: timeLeft, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, handleGameEnd: handleGameEnd, isPaused: isPaused, setIsPaused: setIsPaused, totalPot: pot, middleStack: middleStack, totalRebuys: totalRebuys, outPlayers: outPlayers, formatTime: formatTime })] }) }));
};
export default GameControls;
