import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import api from "../api";
import { NewGameForm } from "./NewGameForm";
import SelectPlayersGame from "./SelectPlayersGame";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, } from "@nextui-org/react";
import { CardPlayer } from "./CardPlayer";
const StartGame = ({ championnat, selectedPlayers, setSelectedPLayers, handlePlayerSelect, players, updateAfterGameEnd, }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [games, setGames] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [blind, setBlind] = useState(1); // Replace with your initial blind value
    const [outPlayers, setOutPlayers] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [isSelectPlayersModalOpen, setSelectPlayersModalOpen] = useState(true);
    const [killer, setKiller] = useState(false);
    const [currentPlayerId, setCurrentPlayerId] = useState(null);
    const [newGame, setNewGame] = useState({
        date: new Date(),
        points: 0,
        rebuys: 0,
    });
    useEffect(() => {
        if (!gameStarted) {
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((time) => {
                if (isPaused) {
                    return time; // If the game is paused, don't decrement timeLeft
                }
                if (time === 0) {
                    setBlind((blind) => blind * 2);
                    return 20 * 60; // reset time
                }
                else {
                    return time - 1;
                }
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [gameStarted, isPaused]);
    const openPlayerModal = () => {
        setSelectPlayersModalOpen(true);
    };
    const closePlayerModal = () => {
        setSelectPlayersModalOpen(false);
    };
    const noTournaments = championnat.length === 0;
    const onStartGame = async () => {
        console.log("Attempting to start the game..."); // add this line
        if (selectedPlayers.length < 4) {
            alert("Please select at least 4 players before starting a new game");
        }
        else {
            setSelectPlayersModalOpen(true); // Close the "Select Players" modal
        }
        // vérifiez si aucun tournoi n'existe
        const actualTournamentId = noTournaments ? null : selectedTournamentId;
        try {
            const response = await api.post("/playerStats/start", {
                date: new Date(),
                players: selectedPlayers.map((player) => player.id),
                tournamentId: actualTournamentId, // Utilisez cette variable ici
            });
            if (response.data && response.data.message) {
                alert(response.data.message);
                setGameStarted(true);
                if (response.data.playerStats &&
                    Array.isArray(response.data.playerStats)) {
                    setGames(response.data.playerStats);
                }
            }
        }
        catch (err) {
            console.error("Server response:", err.response?.data);
            console.error(err);
            alert("Failed to start new game");
        }
        setSelectPlayersModalOpen(false);
    };
    const handleNewGameChange = (event) => {
        setNewGame({ ...newGame, [event.target.name]: event.target.value });
    };
    const handleDateChange = (date) => {
        setNewGame({ ...newGame, date: date });
    };
    const handleRebuy = (playerId) => {
        if (window.confirm("Is this player payed the rebuy?")) {
            openPlayerModal();
            setGames((prevGames) => prevGames.map((game) => game.playerId === playerId
                ? {
                    ...game,
                    rebuys: game.rebuys + 1,
                    totalCost: (game.totalCost ?? 0) + 5,
                }
                : game));
        }
    };
    const calculatePoints = (position) => {
        return position;
    };
    const points = calculatePoints(outPlayers.length);
    console.log("Calculated Points:", points);
    const handlePlayerKillSelection = (killerPlayerId) => {
        setGames((prevGames) => prevGames.map((game) => game.playerId === killerPlayerId
            ? { ...game, kills: game.kills + 1 }
            : game));
        // Fermer la modale après la sélection
        closePlayerModal();
    };
    const handleOutOfGame = async (partyId, playerId, eliminatedById) => {
        console.log("Player ID clicked for Out of Game:", playerId);
        if (window.confirm("Is this player out of the game?")) {
            setKiller(true);
            const gameIndex = games.findIndex((game) => game.playerId === playerId);
            if (gameIndex !== -1) {
                const game = games[gameIndex];
                const outAt = new Date();
                const updatedGameForApi = {
                    ...game,
                    points: calculatePoints(selectedPlayers.length),
                    outAt: outAt.toISOString(),
                };
                const updatedGameForState = {
                    ...game,
                    points: calculatePoints(outPlayers.length + 1),
                    outAt: outAt,
                };
                try {
                    await api.put(`/gamesResults/${game.id}`, updatedGameForApi);
                    await api.put("/playerStats/eliminate", {
                        partyId: partyId,
                        playerId: playerId,
                        eliminatedById: eliminatedById,
                        points: points
                    });
                    setGames((prevGames) => {
                        const newGames = [...prevGames];
                        newGames[gameIndex] = updatedGameForState;
                        return newGames;
                    });
                    setOutPlayers((prevOutPlayers) => {
                        const player = selectedPlayers.find((player) => player.id === playerId);
                        if (player) {
                            return [...prevOutPlayers, player];
                        }
                        else {
                            return prevOutPlayers;
                        }
                    });
                    setSelectedPLayers((prevSelectedPlayers) => {
                        return prevSelectedPlayers.filter((player) => player.id !== playerId);
                    });
                }
                catch (error) {
                    console.error("An error occurred while updating player stats:");
                    console.error("Error object:", error);
                    if (error.response) {
                        console.error("Server responded with:", error.response.data);
                    }
                    if (error.request) {
                        console.error("The request was made but no response was received:", error.request);
                    }
                }
            }
        }
    };
    const handleGameEnd = async () => {
        if (window.confirm("Are you sure you want to stop the game?")) {
            // Here, no need to map over selectedPlayers, just use the games state
            try {
                // Make API call to save results to the database
                const res = await api.post("/gameResults", games);
                // After the results are saved successfully, update the parent component
                updateAfterGameEnd(games);
            }
            catch (error) {
                console.error("Error:", error);
            }
            setIsOpen(false);
        }
    };
    console.log(games);
    console.log("si game started", gameStarted);
    const currentlyPlayingPlayers = games.filter(game => !game.outAt).map(game => {
        return players.find(player => player.id === game.playerId);
    });
    return (_jsxs("div", { className: "", children: [_jsxs(Modal, { isOpen: !gameStarted, onClose: closePlayerModal, children: [_jsx(ModalHeader, { children: "Select Players and Game Details" }), _jsx(ModalBody, { children: _jsxs("div", { children: [_jsx(SelectPlayersGame, { players: players, selectedPlayers: selectedPlayers, handlePlayerSelect: handlePlayerSelect, onStartGame: onStartGame, championnat: championnat, selectedTournamentId: selectedTournamentId, setSelectedTournamentId: setSelectedTournamentId }), _jsx("h2", { children: "Game in Progress" }), _jsx(NewGameForm, { newGame: newGame, handleNewGameChange: handleNewGameChange, handleDateChange: handleDateChange, handleAddNewGame: onStartGame })] }) })] }), _jsxs(Modal, { isOpen: gameStarted, onClose: handleGameEnd, children: [_jsx(ModalHeader, { children: "Game in Progress" }), _jsx(ModalBody, { children: _jsxs("div", { style: {
                                margin: "10 auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }, children: [gameStarted && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-5 flex flex-col items-center", children: [_jsx("div", { children: _jsxs(Button, { color: "warning", variant: "bordered", style: { padding: "20", fontFamily: "font-ds-digi" }, children: ["Time left: ", timeLeft, " seconds."] }) }), _jsxs("div", { children: ["Small blind: ", blind, " / Big Blind :", blind * 2] })] }), _jsx(Button, { onClick: handleGameEnd, children: "Stop Partie" }), _jsx(Button, { className: "rounded-full", onClick: () => setIsPaused(!isPaused), children: isPaused ? "Resume" : "Pause" })] })), _jsx("div", { style: { display: "flex", flexDirection: "row", flexWrap: "wrap" }, children: currentlyPlayingPlayers.map((player) => {
                                        // Trouver le jeu correspondant au joueur actuel
                                        const gameForPlayer = games.find((game) => game.playerId === player?.id);
                                        // Si le jeu existe pour ce joueur, affichez les détails, sinon affichez une erreur
                                        return (_jsx("div", { style: { display: "flex", flexDirection: "column" }, children: gameForPlayer ? (_jsx(CardPlayer, { playername: player?.name ?? " none", recave: gameForPlayer.rebuys, kill: gameForPlayer.kills, rebuy: () => handleRebuy(gameForPlayer.playerId), outOfGame: () => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById) })) : (_jsxs("div", { children: ["Erreur: Pas de jeu pour ", player?.name] })) }, player?.id));
                                    }) })] }) }), _jsx(ModalFooter, { children: gameStarted && (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: handleGameEnd, children: "Stop Partie" }), _jsx(Button, { onClick: () => setIsPaused(!isPaused), children: isPaused ? "Resume" : "Pause" })] })) })] }), _jsxs(Modal, { isOpen: killer, onClose: closePlayerModal, style: { zIndex: 2000 }, children: [_jsx(ModalHeader, { children: "Select a Killer" }), _jsx(ModalBody, { children: _jsx("ul", { children: games &&
                                games.map((game) => {
                                    const player = currentlyPlayingPlayers.find((p) => p?.id === game.playerId);
                                    if (player && !game.outAt) {
                                        return (_jsx("li", { onClick: () => handlePlayerKillSelection(player.id), children: player.name }, player.id));
                                    }
                                    else {
                                        return null; // Si le joueur n'est pas trouvé ou est "out", ne rien retourner
                                    }
                                }) }) })] })] }));
};
export default StartGame;
//# sourceMappingURL=StartGame.js.map