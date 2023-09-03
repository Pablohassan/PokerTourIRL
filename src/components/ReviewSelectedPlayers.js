import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@nextui-org/react';
import bgReview from '../assets/bgpokerreview.png';
import { useNavigate } from 'react-router-dom';
const blindLevels = [
    { small: 10, big: 20, duration: '20m' },
    { small: 25, big: 50, duration: '20m' },
    { small: 50, big: 100, duration: '20m' },
    { small: 100, big: 200, duration: '20m' },
    { small: 150, big: 300, duration: '20m' },
    { small: 200, big: 400, duration: '20m' },
    { small: 300, big: 600, duration: '20m' },
    { small: 400, big: 800, duration: '20m' },
    { small: 500, big: 1000, duration: '20m' },
    { small: 600, big: 1200, duration: '20m' },
    { small: 700, big: 1400, duration: '20m' },
    { small: 800, big: 1600, duration: '20m' },
    { small: 900, big: 1800, duration: '20m' },
    { small: 1000, big: 2000, duration: '20m' },
    { small: 1500, big: 3000, duration: '20m' },
    { small: 2000, big: 4000, duration: '20m' },
];
const ReviewSelectedPlayers = ({ selectedPlayers, onConfirm }) => {
    const navigate = useNavigate();
    return (_jsx("div", { children: _jsx("div", { className: "bg-cover bg-center h-screen w-full flex justify-center items-center", style: { backgroundImage: `url(${bgReview})` }, children: _jsxs("div", { className: "h-full flex justify-center items-center p-10  blur-md invert drop-shadow-xl", children: [_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center border-2 border-white  bg-auto bg-black", children: [_jsx("h3", { className: "text-xl text-white mb-4 ", children: "Joueurs inscrits" }), _jsx("ul", { className: "mb-8 pb-24", children: selectedPlayers.map(player => (_jsx("li", { className: " text-lg text-white shadow-xl ", children: player.name }, player.id))) }), _jsxs("div", { className: "space-y-4 p-2 m-2", children: [_jsx(Button, { style: { padding: "2px", margin: "10px", fontWeight: "bold" }, color: "success", onClick: onConfirm, children: "Confirm and Start Game" }), _jsx(Button, { color: "danger", onClick: () => navigate("/partypage"), children: "Back" })] })] }), _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center", children: [_jsx("div", { className: "text-xl text-white mb-4", children: "Blinds Structure" }), _jsxs("table", { className: "text-white border-collapse border-2 border-white w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "border-1 border-white p-2 ", children: "Level" }), _jsx("th", { className: "border-1 border-white p-2", children: "Small Blind" }), _jsx("th", { className: "border-1 border-white p-2", children: "Big Blind" }), _jsx("th", { className: "border-1 border-white p-2", children: "Duration" })] }) }), _jsx("tbody", { children: blindLevels.map((level, index) => (_jsxs("tr", { children: [_jsx("td", { className: "border-2 border-white rounded-md p-2", children: index + 1 }), _jsx("td", { className: "border-2 border-white p-2", children: level.small }), _jsx("td", { className: "border-2 border-white p-2", children: level.big }), _jsx("td", { className: "border-2 border-white p-2", children: level.duration })] }, index))) })] })] })] }) }) }));
};
export default ReviewSelectedPlayers;
//# sourceMappingURL=ReviewSelectedPlayers.js.map