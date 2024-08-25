import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Modal, Button, ModalHeader, useDisclosure, ModalContent, ModalBody, ModalFooter, Switch, Table, TableHeader, TableBody, TableCell, TableColumn, TableRow } from '@nextui-org/react';
import toast from 'react-hot-toast';
const SelectPlayersGame = ({ players, selectedPlayers, handlePlayerSelect, onStartGame }) => {
    const { isOpen, onClose, onOpenChange } = useDisclosure(); // The modal is open by default
    const [currentGame, setCurrentGame] = useState({
        players: selectedPlayers.map(p => p.id),
        tournamentId: null,
    });
    useEffect(() => {
        onOpenChange();
    }, []);
    const handleStartGame = () => {
        if (selectedPlayers.length < 4) {
            toast("séllectionne plus de 4 joueurs");
            return;
        }
        onStartGame();
        onClose(); // <-- Close the modal here
    };
    const onSelectPlayer = (playerId) => {
        setCurrentGame((prevGame) => {
            const isAlreadySelected = prevGame.players.includes(playerId);
            return {
                ...prevGame,
                players: isAlreadySelected
                    ? prevGame.players.filter(id => id !== playerId)
                    : [...prevGame.players, playerId]
            };
        });
    };
    const handlePlayerChange = (playerId) => {
        onSelectPlayer(playerId);
        handlePlayerSelect(playerId);
    };
    return (_jsx(Modal, { style: { height: "750px" }, isOpen: isOpen, isDismissable: true, closeButton: true, children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: " Nouvelle Partie:" }), _jsxs(ModalBody, { style: { overflowY: "auto" }, children: [_jsx(ModalHeader, { children: "Selection des Joueurs" }), _jsxs(Table, { children: [_jsxs(TableHeader, { style: { overflowY: "auto" }, children: [_jsx(TableColumn, { children: "Nom" }), _jsx(TableColumn, { children: "Joueur" })] }), _jsx(TableBody, { style: { overflowY: "auto" }, children: players.map((player) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Switch, { size: "sm", onChange: () => handlePlayerChange(player.id) }) }), _jsxs(TableCell, { children: [" ", _jsx("div", { className: 'text-lg', children: player.name }), " "] })] }, player.id))) })] }), _jsxs("div", { className: 'bg-[length:200px_100px]  bg-black', children: [_jsx(Button, { style: { margin: "2px", fontWeight: "bolder", }, variant: 'bordered', color: 'warning', onClick: () => onClose(), children: "Cancel" }), _jsx(Button, { color: 'success', style: { margin: "2px", fontWeight: "bolder" }, onClick: handleStartGame, children: "Start Game" })] })] }), _jsx(ModalFooter, {})] }) }));
};
export default SelectPlayersGame;
//# sourceMappingURL=SelectPlayersGame.js.map