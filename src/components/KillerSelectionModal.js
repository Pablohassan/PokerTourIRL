import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ButtonGroup } from "@nextui-org/react";
const KillerSelectionModal = ({ killer, games, currentlyPlayingPlayers, rebuyPlayerId, playerOutGame, handlePlayerKillSelection }) => {
    return (_jsx(Modal, { isOpen: killer, children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: "Select a Killer" }), _jsx(ModalBody, { children: _jsx("div", { children: games &&
                            games.map((game) => {
                                const player = currentlyPlayingPlayers.find((p) => p?.id === game.playerId);
                                if (player && !game.outAt && player.id !== rebuyPlayerId && player.id !== playerOutGame) {
                                    return (_jsx(ButtonGroup, { style: { padding: "2px" }, children: _jsx(Button, { variant: "bordered", color: "warning", onClick: () => handlePlayerKillSelection(player.id), children: player.name }) }, player.id));
                                }
                                return null;
                            }) }) })] }) }));
};
export default KillerSelectionModal;
