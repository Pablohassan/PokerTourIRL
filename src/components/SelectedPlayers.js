import { jsx as _jsx } from "react/jsx-runtime";
export const SelectedPlayers = ({ selectedPlayers }) => {
    return (_jsx("ul", { children: selectedPlayers.map((player) => (_jsx("li", { children: player.name }, player.name))) }));
};
//# sourceMappingURL=SelectedPlayers.js.map