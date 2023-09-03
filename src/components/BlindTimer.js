import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Modal, ModalBody, ModalHeader } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import alerteSon from '../assets/alarmpok.mp3';
const BlindTimer = ({ gameStarted, isPaused, onBlindChange, onTimeChange }) => {
    const [timeLeft, setTimeLeft] = useState(20 * 60); // Initial time in seconds
    const [blindIndex, setBlindIndex] = useState(0);
    const [playAlert, setPlayAlert] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const blinds = [
        { small: 10, big: 20, ante: 0 },
        { small: 25, big: 50, ante: 0 },
        { small: 50, big: 100, ante: 0 },
        { small: 100, big: 200, ante: 0 },
        { small: 150, big: 300, ante: 0 },
        { small: 200, big: 400, ante: 0 },
        { small: 250, big: 500, ante: 0 },
        { small: 300, big: 600, ante: 0 },
        { small: 400, big: 800, ante: 10 },
        { small: 500, big: 1000, ante: 10 },
        { small: 600, big: 1200, ante: 25 },
        { small: 700, big: 1400, ante: 25 },
        { small: 800, big: 1600, ante: 50 },
        { small: 900, big: 1800, ante: 50 },
        { small: 1000, big: 2000, ante: 100 }
    ];
    useEffect(() => {
        if (!gameStarted) {
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((time) => {
                if (isPaused) {
                    return time;
                }
                if (time === 0) {
                    setPlayAlert(true);
                    setShowModal(true);
                    let newBlindIndex = blindIndex;
                    if (blindIndex < blinds.length - 1) {
                        newBlindIndex = blindIndex + 1;
                        setBlindIndex(newBlindIndex);
                    }
                    onBlindChange(blinds[newBlindIndex].small, blinds[newBlindIndex].big);
                    // onAnteChange(blinds[newBlindIndex].ante);
                    return 20 * 60; // reset time
                }
                else {
                    return time - 1;
                }
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameStarted, isPaused, blindIndex, onBlindChange, blinds]);
    useEffect(() => {
        if (showModal) {
            const timer = setTimeout(() => {
                setShowModal(false);
                setPlayAlert(false); // Also stop the sound effect
            }, 10000); // 10 seconds
            return () => clearTimeout(timer); // Cleanup
        }
    }, [showModal]);
    useEffect(() => {
        onTimeChange(timeLeft);
    }, [timeLeft, onTimeChange]);
    const handleCloseModal = () => {
        setShowModal(false);
    };
    return (_jsxs(_Fragment, { children: [playAlert && _jsx("audio", { src: alerteSon, autoPlay: true }), _jsx(Modal, { isOpen: showModal, className: "fixed inset-0 flex items-center justify-center z-50", onClick: handleCloseModal, children: _jsxs("div", { className: "relative w-4/5 h-4/5 bg-white shadow-lg overflow-auto", onClick: (e) => e.stopPropagation(), children: [_jsx(ModalHeader, { children: "New Blind Level" }), _jsxs(ModalBody, { children: ["Small: ", blinds[blindIndex].small, " / Big: ", blinds[blindIndex].big, " Ante: ", blinds[blindIndex].ante] })] }) })] }));
};
export default BlindTimer;
//# sourceMappingURL=BlindTimer.js.map