import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@nextui-org/react';
const ReviewSelectedPlayers = ({ selectedPlayers, onConfirm }) => {
    return (_jsxs("div", { style: { width: "800px", height: "400px", border: "solid" }, children: [_jsx("h3", { style: { color: "red" }, children: "Review Selected Players" }), _jsx("ul", { children: selectedPlayers.map(player => (_jsx("li", { children: player.name }, player.id))) }), _jsx(Button, { onClick: onConfirm, children: "Confirm and Start Game" })] }));
};
export default ReviewSelectedPlayers;
//# sourceMappingURL=ReviewSelectedPlayers.js.map