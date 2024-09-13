import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
import BlindTimer from "./BlindTimer";
import GameTimer from "./GameTimer";
const GameControls = ({ gameStarted, isPaused, timeLeft, smallBlind, bigBlind, ante, handleGameEnd, setIsPaused, pot, middleStack, setSmallBlind, setBigBlind, setAnte, setTimeLeft, blindIndex, setBlindIndex, initialTimeLeft }) => {
    const timerRef = useRef(null);
    useEffect(() => {
    }, [initialTimeLeft]);
    useEffect(() => {
        if (!isPaused && gameStarted && timeLeft > 0) {
            timerRef.current = window.setTimeout(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }
        else if (timeLeft === 0) {
            setSmallBlind((prev) => prev * 2);
            setBigBlind((prev) => prev * 2);
            setTimeLeft(initialTimeLeft); // Reset the timer
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isPaused, gameStarted, timeLeft, setSmallBlind, setBigBlind, setTimeLeft, initialTimeLeft]);
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (_jsx("div", { children: gameStarted && (_jsxs("div", { children: [_jsx(BlindTimer, { gameStarted: gameStarted, isPaused: isPaused, onBlindChange: (small, big, ante) => {
                        setSmallBlind(small);
                        setBigBlind(big);
                        setAnte(ante);
                    }, onTimeChange: (time) => setTimeLeft(time), blindIndex: blindIndex, setBlindIndex: setBlindIndex, initialTimeLeft: initialTimeLeft }), _jsx(GameTimer, { timeLeft: timeLeft, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, handleGameEnd: handleGameEnd, isPaused: isPaused, setIsPaused: setIsPaused, totalPot: pot, middleStack: middleStack, formatTime: formatTime })] })) }));
};
export default GameControls;
