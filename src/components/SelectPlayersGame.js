import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Modal, Button, ModalHeader, useDisclosure, ModalContent, ModalBody, ModalFooter, Switch, Table, TableHeader, TableBody, TableCell, TableColumn, TableRow } from '@nextui-org/react';
import toast from 'react-hot-toast';
const SelectPlayersGame = ({ setSelectedTournamentId, selectedTournamentId, championnat, players, selectedPlayers, handlePlayerSelect, onStartGame }) => {
    const { isOpen, onClose, onOpenChange } = useDisclosure(); // The modal is open by default
    const [currentGame, setCurrentGame] = useState({
        players: selectedPlayers.map(p => p.id),
        tournamentId: selectedTournamentId,
    });
    const noTournaments = championnat.length === 0; // vérifiez si aucun tournoi n'existe
    const handleStartGame = () => {
        if (selectedPlayers.length < 4 || !selectedTournamentId) {
            toast("Choisis un Tournois et séllectionne plus de 4 joueurs");
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
        onSelectPlayer(playerId);
        handlePlayerSelect(playerId);
    };
    const handleTournamentChange = (tournamentId) => {
        onSelectTournament(tournamentId);
        setSelectedTournamentId(tournamentId);
    };
    return (_jsx(Modal, { isOpen: true, isDismissable: true, closeButton: true, children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { className: "with-full height-full", children: " Nouvelle Partie:" }), _jsxs(ModalBody, { children: [_jsx("div", { children: !noTournaments ? (_jsxs("select", { value: selectedTournamentId ?? "", onChange: (e) => handleTournamentChange(Number(e.target.value)), children: [_jsx("option", { value: "", disabled: true, children: "Selectionne un tournois" }), championnat.map((tournament) => (_jsxs("option", { value: tournament.id, children: ["Pitch Poker Tour ", tournament.year] }, tournament.id)))] })) : (_jsx("p", { children: "No tournaments available. A new tournament will be created automatically." })) }), _jsx(ModalHeader, { children: "Selection des Joueurs" }), _jsxs(Table, { children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { children: "Nom" }), _jsx(TableColumn, { children: "Joueur" })] }), _jsx(TableBody, { children: players.map((player) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Switch, { size: "sm", onChange: () => handlePlayerChange(player.id) }) }), _jsxs(TableCell, { children: [" ", _jsx("div", { className: 'text-lg', children: player.name }), " "] })] }, player.id))) })] }), _jsxs("div", { children: [_jsx(Button, { className: 'p-4 m-4', variant: 'bordered', onClick: () => onOpenChange(), children: "Cancel" }), _jsx(Button, { color: 'success', className: 'p-4 m-4', onClick: handleStartGame, children: "Start Game" })] })] }), _jsx(ModalFooter, {})] }) }));
};
export default SelectPlayersGame;
//# sourceMappingURL=SelectPlayersGame.js.map