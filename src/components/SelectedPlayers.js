import { jsx as _jsx } from "react/jsx-runtime";
export const SelectedPlayers = ({ selectedPlayers }) => {
    return (_jsx("ul", { children: selectedPlayers.map((player) => (_jsx("div", { children: _jsx("li", { children: player.name }, player.name) }, player.id))) }));
};
//# sourceMappingURL=SelectedPlayers.js.map