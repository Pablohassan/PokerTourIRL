import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { NewGameForm } from "./NewGameForm";
import SelectPlayersGame from "./SelectPlayersGame";
import ReviewSelectedPlayers from "../components/ReviewSelectedPlayers";
import { Modal, Button, ModalHeader, ModalBody, ModalFooter, ModalContent, ButtonGroup, } from "@nextui-org/react";
import { CardPlayer } from "./CardPlayer";
import toast from "react-hot-toast";
const StartGame = ({ championnat, selectedPlayers, setSelectedPLayers, handlePlayerSelect, players, updateAfterGameEnd, }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [games, setGames] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [blind, setBlind] = useState(10); // Replace with your initial blind value
    const [outPlayers, setOutPlayers] = useState([]);
    const [initialPlayerCount, setInitialPlayerCount] = useState(0);
    // const [isOpen, setIsOpen] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [playerInGame, setPlayerInGame] = useState([]);
    const [killer, setKiller] = useState(false);
    const [isSelectPlayersModalOpen, setIsSelectPlayersModalOpen] = useState(true);
    const [rebuyPlayerId, setRebuyPlayerId] = useState(null);
    const [newGame, setNewGame] = useState({
        date: new Date(),
        points: 0,
        rebuys: 0,
    });
    const navigate = useNavigate();
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
    // const closePlayerModal = () => {
    //   setSelectPlayersModalOpen(false);
    // };
    const onStartGameReview = () => {
        setShowReview(true);
    };
    const confirmAndStartGame = async () => {
        setShowReview(false); // Hide the review
        await onStartGame(); // Now, start the game
    };
    const closeSelectPlayersModal = () => {
        setIsSelectPlayersModalOpen(false);
    };
    const noTournaments = championnat.length === 0;
    const onStartGame = async () => {
        // setSelectPlayersModalOpen(true); // Close the "Select Players" modal
        const actualTournamentId = noTournaments ? null : selectedTournamentId;
        try {
            const response = await api.post("/playerStats/start", {
                date: new Date(),
                players: selectedPlayers.map((player) => player.id),
                tournamentId: actualTournamentId, // Utilisez cette variable ici
            });
            if (response.data && response.data.message) {
                toast(response.data.message);
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
            toast("Failed to start new game");
        }
        setInitialPlayerCount(selectedPlayers.length);
        // setSelectPlayersModalOpen(false);
    };
    const handleNewGameChange = (event) => {
        setNewGame({ ...newGame, [event.target.name]: event.target.value });
    };
    const handleDateChange = (date) => {
        setNewGame({ ...newGame, date: date });
    };
    const handleRebuy = (playerId) => {
        setRebuyPlayerId(playerId);
        if (window.confirm("Is this player payed the rebuy?")) {
            setKiller(true);
            setGames((prevGames) => prevGames.map((game) => game.playerId === playerId
                ? {
                    ...game,
                    rebuys: game.rebuys + 1,
                    totalCost: (game.totalCost ?? 0) + 5,
                }
                : game));
        }
    };
    const calculatePoints = (position, isWinner = false) => {
        if (isWinner) {
            return initialPlayerCount; // Maximum points for the winner
        }
        return initialPlayerCount - position + 1;
    };
    const points = calculatePoints(outPlayers.length);
    console.log("Calculated Points:", points);
    const handlePlayerKillSelection = (killerPlayerId) => {
        if (window.confirm("Do you want to select this player as the killer?")) {
            setKiller(true);
            setGames((prevGames) => prevGames.map((game) => game.playerId === killerPlayerId
                ? { ...game, kills: game.kills + 1 }
                : game));
            // Fermer la modale après la sélection
            setKiller(false);
        }
    };
    const handleOutOfGame = async (partyId, playerId, eliminatedById) => {
        console.log("Player ID clicked for Out of Game:", playerId);
        if (window.confirm(`Is ${playerId} out of the game?`)) {
            setKiller(true);
            const position = initialPlayerCount - outPlayers.length; // Calculate the position
            const gameIndex = games.findIndex((game) => game.playerId === playerId);
            if (gameIndex !== -1) {
                const game = games[gameIndex];
                const outAt = new Date();
                const points = calculatePoints(position);
                const updatedGameForApi = {
                    ...game,
                    points: points,
                    outAt: outAt.toISOString(),
                    position: position
                };
                const updatedGameForState = {
                    ...game,
                    points: points,
                    outAt: outAt,
                    position: position,
                };
                try {
                    await api.put(`/gamesResults/${game.id}`, updatedGameForApi);
                    await api.put("/playerStats/eliminate", {
                        partyId: partyId,
                        playerId: playerId,
                        eliminatedById: eliminatedById,
                        points: points,
                        position: position
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
        if (currentlyPlayingPlayers.length > 1) {
            alert("There should be at most one player left to end the game.");
            return;
        }
        if (window.confirm("Are you sure you want to stop the game?")) {
            let updatedGames = [...games];
            if (currentlyPlayingPlayers.length === 1) {
                const position = initialPlayerCount - outPlayers.length;
                const points = calculatePoints(position);
                const winningPlayerId = currentlyPlayingPlayers[0]?.id;
                const outAt = new Date();
                updatedGames = updatedGames.map((game) => game.playerId === winningPlayerId
                    ? { ...game, points: points, outAt: outAt, position: position }
                    : game);
                setGames(updatedGames);
            }
            // Here, no need to map over selectedPlayers, just use the games state
            try {
                // Make API call to save results to the database
                const res = await api.post("/gameResults", updatedGames);
                // After the results are saved successfully, update the parent component
                updateAfterGameEnd(updatedGames);
            }
            catch (error) {
                console.error("Error:", error);
            }
            setGameStarted(false);
            navigate("/results");
        }
    };
    console.log(games);
    console.log("si game started", gameStarted);
    const currentlyPlayingPlayers = games
        .filter((game) => !game.outAt)
        .map((game) => {
        return players.find((player) => player.id === game.playerId);
    });
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };
    return (_jsxs("div", { className: "", children: [_jsx(Modal, { isOpen: killer, children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { className: "with-full height-full", children: "Select a Killer" }), _jsx(ModalBody, { children: _jsx("div", { color: "danger", children: games &&
                                    games.map((game) => {
                                        const player = currentlyPlayingPlayers.find((p) => p?.id === game.playerId);
                                        if (player && !game.outAt && player.id !== rebuyPlayerId) {
                                            return (_jsx(ButtonGroup, { children: _jsx(Button, { color: "warning", className: "text-lg p-2 m-1", onClick: () => handlePlayerKillSelection(player.id), children: player.name }, player.id) }));
                                        }
                                        else {
                                            return null; // Si le joueur n'est pas trouvé ou est "out", ne rien retourner
                                        }
                                    }) }) })] }) }), _jsxs(Modal, { isOpen: !gameStarted, children: [_jsx(ModalHeader, { children: "Select Players and Game Details" }), _jsx(ModalBody, { children: _jsxs(Modal, { isOpen: isSelectPlayersModalOpen, children: [_jsx(SelectPlayersGame, { players: players, selectedPlayers: selectedPlayers, handlePlayerSelect: handlePlayerSelect, onStartGame: onStartGameReview, championnat: championnat, selectedTournamentId: selectedTournamentId, setSelectedTournamentId: setSelectedTournamentId }), _jsx("h2", { children: "Game in Progress" }), _jsx(NewGameForm, { newGame: newGame, handleNewGameChange: handleNewGameChange, handleDateChange: handleDateChange, handleAddNewGame: onStartGame })] }) })] }), showReview ? (_jsx(ReviewSelectedPlayers, { selectedPlayers: selectedPlayers, onConfirm: confirmAndStartGame })) : (_jsxs("div", { children: [" ", _jsxs(Modal, { isOpen: gameStarted, onClose: handleGameEnd, children: [_jsx(ModalHeader, { className: "text-2xl bg-color-red", children: "Game in Progress" }), _jsx(ModalBody, { children: _jsxs("div", { style: {
                                        margin: "10 auto",
                                        // display: "flex",
                                        // justifyContent: "center",
                                    }, children: [gameStarted && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "p-5 flex flex-col items-center border-black", children: [_jsxs("div", { className: "text-lg", children: ["Time left: ", formatTime(timeLeft), " seconds."] }), _jsxs("div", { className: "text-lg", children: ["Small blind: ", blind, " / Big Blind :", blind * 2] })] }), _jsx(Button, { onClick: handleGameEnd, children: "Stop Partie" }), _jsx(Button, { className: "rounded-full", onClick: () => setIsPaused(!isPaused), children: isPaused ? "Resume" : "Pause" })] })), _jsx("div", { style: {
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                            }, children: currentlyPlayingPlayers.map((player) => {
                                                // Trouver le jeu correspondant au joueur actuel
                                                const gameForPlayer = games.find((game) => game.playerId === player?.id);
                                                // Si le jeu existe pour ce joueur, affichez les détails, sinon affichez une erreur
                                                return (_jsx("div", { style: { display: "flex", flexDirection: "column" }, children: gameForPlayer ? (_jsx(CardPlayer, { playername: player?.name ?? " none", recave: gameForPlayer.rebuys, kill: gameForPlayer.kills, rebuy: () => handleRebuy(gameForPlayer.playerId), outOfGame: () => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById) })) : (_jsxs("div", { children: ["Erreur: Pas de jeu pour ", player?.name] })) }, player?.id));
                                            }) })] }) }), _jsx(ModalFooter, { children: gameStarted && (_jsxs(_Fragment, { children: [_jsx(Button, { onClick: handleGameEnd, children: "Stop Partie" }), _jsx(Button, { onClick: () => setIsPaused(!isPaused), children: isPaused ? "Resume" : "Pause" })] })) })] })] }))] }));
};
export default StartGame;
//# sourceMappingURL=StartGame.js.map