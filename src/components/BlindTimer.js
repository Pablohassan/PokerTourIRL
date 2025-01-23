import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import alerteSon from '../assets/alarmpok.mp3';
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "./ui/dialog";
import { cn } from "../lib/utils";
const BlindTimer = ({ gameStarted, isPaused, onBlindChange, onTimeChange, blindIndex, setBlindIndex, initialTimeLeft }) => {
    const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
    const [playAlert, setPlayAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const isUpdatingRef = useRef(false);
    const nextBlindIndexRef = useRef(blindIndex);
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
        { small: 2500, big: 5000, ante: 500 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3000, big: 6000, ante: 1000 },
    ];
    const updateBlinds = useCallback(() => {
        if (isUpdatingRef.current)
            return;
        isUpdatingRef.current = true;
        try {
            const nextIndex = blindIndex + 1;
            if (nextIndex >= blinds.length) {
                toast.error("Maximum blind level reached!");
                isUpdatingRef.current = false;
                return;
            }
            nextBlindIndexRef.current = nextIndex;
            // Update blinds immediately
            const { small, big, ante } = blinds[nextIndex];
            onBlindChange(small, big, ante);
            setBlindIndex(nextIndex);
            // Show modal and play alert
            setPlayAlert(true);
            setShowModal(true);
            // Set a timeout to close modal and reset timer
            setTimeout(() => {
                setShowModal(false);
                setPlayAlert(false);
                setTimeLeft(initialTimeLeft);
                isUpdatingRef.current = false;
            }, 5000);
        }
        catch (error) {
            console.error('Error updating blinds:', error);
            toast.error('Failed to update blinds');
            isUpdatingRef.current = false;
        }
    }, [blindIndex, blinds.length, onBlindChange, initialTimeLeft, setBlindIndex]);
    // Effect for time updates
    useEffect(() => {
        console.log('Timer Effect - Initial Setup:', { gameStarted, isPaused, timeLeft, initialTimeLeft });
        let timerId = null;
        const startTimer = () => {
            if (timerId)
                return; // Prevent multiple timers
            console.log('Starting new timer with:', { timeLeft, initialTimeLeft });
            timerId = setInterval(() => {
                setTimeLeft(prevTime => {
                    const newTime = prevTime - 1;
                    console.log('Timer tick:', { prevTime, newTime });
                    if (newTime <= 0) {
                        console.log('Timer reached 0 - Updating blinds');
                        updateBlinds();
                        return 0;
                    }
                    return newTime;
                });
            }, 1000);
        };
        const stopTimer = () => {
            console.log('Stopping timer');
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }
        };
        if (gameStarted && !isPaused) {
            startTimer();
        }
        else {
            stopTimer();
        }
        return () => {
            console.log('Cleanup - stopping timer');
            stopTimer();
        };
    }, [gameStarted, isPaused]); // Remove unnecessary dependencies
    // Debug time changes
    useEffect(() => {
        console.log('Time value changed:', { timeLeft, gameStarted, isPaused });
    }, [timeLeft, gameStarted, isPaused]);
    // Notify parent of time changes
    useEffect(() => {
        if (typeof timeLeft === 'number' && !isNaN(timeLeft)) {
            onTimeChange(timeLeft);
        }
    }, [timeLeft, onTimeChange]);
    // Get the current blinds to display
    const displayBlinds = blinds[nextBlindIndexRef.current] || blinds[blindIndex];
    return (_jsxs(_Fragment, { children: [playAlert && _jsx("audio", { src: alerteSon, autoPlay: true }), _jsx(AnimatePresence, { children: showModal && (_jsx(Dialog, { open: showModal, onOpenChange: setShowModal, children: _jsx(DialogContent, { className: cn("bg-zinc-950/95 border-amber-500/50", "backdrop-blur-lg", "shadow-[0_0_50px_-5px_rgba(245,158,11,0.3)]", "max-w-[95vw] sm:max-w-[500px]", "p-6 sm:p-8", "border-2"), children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.3, ease: "easeOut" }, children: [_jsx(DialogHeader, { className: "mb-6", children: _jsxs(motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1, duration: 0.5 }, children: [_jsx(DialogTitle, { className: cn("font-['DS-DIGI']", "text-4xl sm:text-5xl", "text-center", "text-amber-400", "tracking-wider", "font-bold", "mb-2"), children: "Blind Change!" }), _jsx("p", { className: "text-amber-400/80 text-center text-lg sm:text-xl font-['DS-DIGI']", children: "New blinds for next hand" })] }) }), _jsxs(motion.div, { className: "space-y-6", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2, duration: 0.5 }, children: [_jsx("div", { className: "bg-zinc-900/80 rounded-xl p-4 sm:p-6 border border-amber-500/20", children: _jsxs("div", { className: "space-y-4", children: [_jsxs(motion.div, { className: "flex justify-between items-center", initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: 0.3, duration: 0.5 }, children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl", children: "Small Blind" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-3xl sm:text-4xl", children: displayBlinds.small })] }), _jsxs(motion.div, { className: "flex justify-between items-center", initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: 0.4, duration: 0.5 }, children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl", children: "Big Blind" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-3xl sm:text-4xl", children: displayBlinds.big })] }), _jsx("div", { className: "h-px bg-amber-400/20 my-4" }), _jsxs(motion.div, { className: "flex justify-between items-center", initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: 0.5, duration: 0.5 }, children: [_jsx("span", { className: "font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl", children: "Ante" }), _jsx("span", { className: "font-['DS-DIGI'] text-amber-400 text-3xl sm:text-4xl", children: displayBlinds.ante })] })] }) }), _jsx(motion.div, { className: "text-center text-amber-400/60 text-sm sm:text-base font-['DS-DIGI']", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.6, duration: 0.5 }, children: "Modal will close automatically in a few seconds..." })] })] }) }) })) })] }));
};
export default BlindTimer;
