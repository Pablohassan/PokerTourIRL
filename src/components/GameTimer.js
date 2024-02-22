import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { Button } from '@nextui-org/react'; // Replace with the actual path to your Button component
const GameTimer = ({ middleStack, totalPot, formatTime, timeLeft, smallBlind, bigBlind, handleGameEnd, isPaused, setIsPaused, ante }) => {
    const handleKeyDown = (event) => {
        if (event.code === 'Space') { // Using 'code' is more reliable than 'keyCode'
            event.preventDefault(); // Prevent the default spacebar action
            event.stopPropagation();
            const target = event.target;
            // Only toggle the timer if the space key is not pressed on interactive elements
            if (!['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
                setIsPaused(!isPaused);
            }
        }
    };
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isPaused]);
    return (_jsxs("div", { style: {
            display: 'grid',
            gridTemplateRows: '3fr 1fr',
            height: '420px',
            width: '970px',
            border: '4px solid black',
            borderRadius: '16px',
            background: 'rgba(0, 0, 0, 0.2)',
            boxShadow: '0px 4px 6px rgba(0, 0,5, 0, 0.3)'
        }, children: [_jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '10px',
                    borderBottom: '2px solid #D1D5DB'
                }, children: [_jsxs("div", { style: {
                            fontFamily: "DS-DIGI",
                            alignItems: "center",
                            fontSize: '2.5em',
                            height: "95%",
                            width: "40%",
                            padding: '10px',
                            margin: '10px',
                            border: "4px solid black",
                            borderRadius: '12px',
                            background: '#100D14',
                            color: 'white',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
                        }, children: ["Time left:", _jsx("div", { style: { fontSize: "3.5em", alignItems: "center", padding: '2px' }, children: formatTime(timeLeft) })] }), _jsxs("div", { style: {
                            fontFamily: "DS-DIGI",
                            height: '95%',
                            fontSize: '3em',
                            padding: '10px',
                            width: '30%',
                            borderRadius: '12px',
                            background: '#100D14',
                            margin: '10px',
                            color: 'white',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
                        }, children: ["Small : ", smallBlind, " ", _jsxs("div", { children: ["Big : ", bigBlind] }), _jsx("div", { style: { background: "white", width: "100%", height: "2px", margin: "5px" } }), _jsxs("div", { style: { marginTop: '8px' }, children: ["Ante: ", ante] })] }), _jsxs("div", { style: {
                            fontFamily: "DS-DIGI",
                            height: '95%',
                            fontSize: '2.5em',
                            padding: '20px',
                            width: '30%',
                            borderRadius: '12px',
                            background: '#100D14', // different background for demonstration
                            margin: '10px',
                            color: 'white',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
                        }, children: [_jsxs("div", { children: [" Pot : ", totalPot, " "] }), _jsxs("div", { children: ["M-Stack ", middleStack] })] })] }), _jsx("div", { style: { background: "black", width: "100%", height: "2px", margin: "5px" } }), _jsxs("div", { style: {
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    paddingBottom: '15px',
                }, children: [_jsx("div", { children: _jsx(Button, { color: "danger", size: 'lg', className: "text-white", onClick: handleGameEnd, children: _jsx("div", { style: { fontSize: "20px" }, children: "Stop Partie" }) }) }), _jsx("div", { children: _jsx(Button, { color: "warning", className: "text-black", size: 'lg', onClick: () => setIsPaused(!isPaused), children: _jsx("div", { style: { fontSize: "2Opx" }, children: isPaused ? 'Resume' : 'Pause' }) }) })] })] }));
};
export default React.memo(GameTimer);
//# sourceMappingURL=GameTimer.js.map