import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal, Button, ModalHeader, useDisclosure, ModalContent, ModalBody, ModalFooter } from '@nextui-org/react';
import toast from 'react-hot-toast';
const SelectPlayersGame = ({ setSelectedTournamentId, selectedTournamentId, championnat, players, selectedPlayers, handlePlayerSelect, onStartGame }) => {
    const { isOpen, onClose, onOpenChange } = useDisclosure(); // The modal is open by default
    const [currentGame, setCurrentGame] = useState({
        players: selectedPlayers.map(p => p.id),
        tournamentId: selectedTournamentId,
    });
    const noTournaments = championnat.length === 0; // vérifiez si aucun tournoi n'existe
    const handleStartGame = () => {
        if (selectedPlayers.length < 4) {
            toast(" select a player and a party before adding a new game");
            return;
        }
        onStartGame();
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
    const onSelectTournament = (tournamentId) => {
        setCurrentGame((prevGame) => ({
            ...prevGame,
            tournamentId: tournamentId,
        }));
    };
    const handlePlayerChange = (playerId) => {
        console.log("Checkbox changed for player with ID:", playerId);
        onSelectPlayer(playerId);
        handlePlayerSelect(playerId);
    };
    const handleTournamentChange = (tournamentId) => {
        onSelectTournament(tournamentId);
        setSelectedTournamentId(tournamentId);
    };
    console.log("All players:", players);
    console.log("players", selectedPlayers);
    console.log("gme", currentGame);
    return (_jsx(Modal, { isOpen: true, isDismissable: true, closeButton: true, children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { className: "with-full height-full", children: "Select Tournois:" }), _jsxs(ModalBody, { children: [_jsx("div", { children: !noTournaments ? (_jsxs("select", { value: selectedTournamentId ?? "", onChange: (e) => handleTournamentChange(Number(e.target.value)), children: [_jsx("option", { value: "", disabled: true, children: "Select a tournament" }), championnat.map((tournament) => (_jsx("option", { value: tournament.id, children: tournament.year }, tournament.id)))] })) : (_jsx("p", { children: "No tournaments available. A new tournament will be created automatically." })) }), _jsx(ModalHeader, { children: "Select Players:" }), _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Select" }), _jsx("th", { children: "Name" })] }) }), _jsx("tbody", { children: players.map((player) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("input", { type: "checkbox", checked: selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id), onChange: () => handlePlayerChange(player.id) }) }), _jsx("td", { children: player.name })] }, player.id))) })] }), _jsxs("div", { children: [_jsx(Button, { variant: 'bordered', onClick: () => onOpenChange(), children: "Cancel" }), _jsx(Button, { onClick: handleStartGame, children: "Start Game" })] })] }), _jsx(ModalFooter, {})] }) }));
};
export default SelectPlayersGame;
//# sourceMappingURL=SelectPlayersGame.js.map