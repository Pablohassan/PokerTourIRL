import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@nextui-org/react';
import bgReview from '../assets/bgpokerreview.png';
import { useNavigate } from 'react-router-dom';
const ReviewSelectedPlayers = ({ selectedPlayers, onConfirm }) => {
    const navigate = useNavigate();
    return (_jsx("div", { children: _jsxs("div", { className: "bg-cover bg-center h-screen w-full flex flex-col justify-center items-center border-x-4 border-white", style: { backgroundImage: `url(${bgReview})` }, children: [_jsx("h3", { className: 'text-xl text-white', children: "Valider la sellection la partie " }), _jsx("div", { className: 'gap-x-10', children: _jsx("ul", { children: selectedPlayers.map(player => (_jsx("li", { className: "text-lg  text-white  ", children: player.name }, player.id))) }) }), _jsx("div", { "space-y-100": true, className: 'p-2 m-2 text-color-black', children: _jsx(Button, { color: 'success', onClick: onConfirm, children: "Confirm and Start Game" }) }), _jsx("div", { className: 'p-2 m-2 text-color-white', children: _jsx(Button, { color: 'danger', onClick: () => navigate("/partypage"), children: "Back " }) })] }) }));
};
export default ReviewSelectedPlayers;
//# sourceMappingURL=ReviewSelectedPlayers.js.map