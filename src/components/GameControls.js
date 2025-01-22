import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useCallback } from "react";
import BlindTimer from "./BlindTimer";
import GameTimer from "./GameTimer";
import { toast } from "react-hot-toast";
import { cn } from "../lib/utils";
const GameControls = ({ gameStarted, isPaused, timeLeft, smallBlind, bigBlind, ante, handleGameEnd, setIsPaused, pot, middleStack, setSmallBlind, setBigBlind, setAnte, setTimeLeft, blindIndex, setBlindIndex, initialTimeLeft, }) => {
    const timerRef = useRef(null);
    const isUpdatingRef = useRef(false);
    const updateBlinds = useCallback(() => {
        if (isUpdatingRef.current)
            return;
        isUpdatingRef.current = true;
        try {
            const blindLevels = [
                { small: 10, big: 20, ante: 0 },
                { small: 20, big: 40, ante: 0 },
                { small: 50, big: 100, ante: 0 },
                { small: 100, big: 200, ante: 25 },
                { small: 200, big: 400, ante: 50 },
                { small: 300, big: 600, ante: 75 },
                { small: 400, big: 800, ante: 100 },
                { small: 500, big: 1000, ante: 125 },
                { small: 600, big: 1200, ante: 150 },
                { small: 800, big: 1600, ante: 200 },
                { small: 1000, big: 2000, ante: 250 },
                { small: 1500, big: 3000, ante: 300 },
                { small: 2000, big: 4000, ante: 500 },
                { small: 3000, big: 6000, ante: 1000 },
                { small: 4000, big: 8000, ante: 1000 },
                { small: 5000, big: 10000, ante: 1000 },
                { small: 6000, big: 12000, ante: 2000 },
                { small: 8000, big: 16000, ante: 2000 },
                { small: 10000, big: 20000, ante: 3000 },
                { small: 15000, big: 30000, ante: 4000 },
            ];
            const nextLevel = blindLevels[blindIndex + 1];
            if (nextLevel) {
                setSmallBlind(nextLevel.small);
                setBigBlind(nextLevel.big);
                setAnte(nextLevel.ante);
                setTimeLeft(initialTimeLeft);
                setBlindIndex((prev) => prev + 1);
                toast.success(`Blinds increased! SB: ${nextLevel.small}, BB: ${nextLevel.big}, Ante: ${nextLevel.ante}`);
            }
            else {
                toast.error("Maximum blind level reached!");
            }
        }
        catch (error) {
            console.error("Error updating blinds:", error);
            toast.error("Failed to update blinds");
        }
        finally {
            isUpdatingRef.current = false;
        }
    }, [setSmallBlind, setBigBlind, setTimeLeft, initialTimeLeft, setBlindIndex, blindIndex, setAnte]);
    useEffect(() => {
        if (!isPaused && gameStarted && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => {
                setTimeLeft((prevTime) => {
                    const newTime = prevTime - 1;
                    if (newTime === 0) {
                        updateBlinds();
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [isPaused, gameStarted, timeLeft, updateBlinds]);
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    if (!gameStarted)
        return null;
    return (_jsx("div", { className: cn("w-full max-w-[1280px] min-h-[370px] mx-auto", "bg-slate-950/95 backdrop-blur-md", "border border-amber-400/10", "shadow-[0_0_35px_-5px_rgba(245,158,11,0.15)]", "rounded-2xl overflow-hidden"), children: _jsxs("div", { className: "space-y-3", children: [_jsx(BlindTimer, { gameStarted: gameStarted, isPaused: isPaused, onBlindChange: (small, big, ante) => {
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
                    }, blindIndex: blindIndex, setBlindIndex: setBlindIndex, initialTimeLeft: initialTimeLeft }), _jsx(GameTimer, { timeLeft: timeLeft, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, handleGameEnd: handleGameEnd, isPaused: isPaused, setIsPaused: setIsPaused, totalPot: pot, middleStack: middleStack, formatTime: formatTime })] }) }));
};
export default GameControls;
