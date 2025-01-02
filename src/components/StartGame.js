import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import GameConfiguration from './GameConfiguration'; // Corriger le nom du fichier
// import { Content } from "./Content";
import ReviewSelectedPlayers from "../components/ReviewSelectedPlayers";
import GameControls from "./GameControls";
import PlayerList from "./PlayerList";
import KillerSelectionModal from "./KillerSelectionModal";
import useGameState from "./useGameState";
import toast from "react-hot-toast";
import { Modal, ModalBody, ModalHeader } from "@nextui-org/react";
const StartGame = ({ championnat, selectedPlayers, setSelectedPLayers, players, updateAfterGameEnd, blindIndex, setBlindIndex }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showConfig, setShowConfig] = useState(true);
    // const [outPlayers, setOutPlayers] = useState<Player[]>([]);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [blindDuration, setBlindDuration] = useState(20);
    const [playerOutGame, setPlayerOutGame] = useState(null);
    const [partyId, setPartyId] = useState(false);
    const [isEnding, setIsEnding] = useState(false);
    // const [lastUsedPosition, setLastUsedPosition] = useState(0);
    const initialTimeLeft = blindDuration * 60;
    const { timeLeft, setTimeLeft, smallBlind, setSmallBlind, bigBlind, setBigBlind, ante, setAnte, games, setGames, pot, setPot, middleStack, setSavedTotalStack, totalStack, setTotalStack, saveGameState, resetGameState, rebuyPlayerId, setRebuyPlayerId, killer, setKiller, stateRestored, postInitialGameState, loading, error, setPositions, outPlayers, // Ajoutez cette ligne
    setOutPlayers, // Ajoutez cette ligne
    setLastUsedPosition, initialPlayerCount, // Récupérer initialPlayerCount ici
    setInitialPlayerCount, } = useGameState(gameStarted, setGameStarted, selectedPlayers, setSelectedPLayers, blindIndex, setBlindIndex, initialTimeLeft);
    const navigate = useNavigate();
    useEffect(() => {
        if (stateRestored) {
            setGameStarted(true);
            setShowConfig(false);
            const totalPlayers = initialPlayerCount; // Utilisez initialPlayerCount restauré ici
            const sortedOutPlayers = games
                .filter((game) => game.outAt)
                .sort((a, b) => {
                const dateA = typeof a.outAt === 'string' ? new Date(a.outAt) : a.outAt;
                const dateB = typeof b.outAt === 'string' ? new Date(b.outAt) : b.outAt;
                return dateA.getTime() - dateB.getTime();
            });
            sortedOutPlayers.forEach((game, index) => {
                const position = totalPlayers - index;
                game.position = position;
                game.points = index + 1;
            });
            setGames((prevGames) => prevGames.map((game) => {
                const updatedGame = sortedOutPlayers.find((g) => g.playerId === game.playerId);
                return updatedGame || game;
            }));
            const restoredOutPlayers = sortedOutPlayers.map(game => {
                const player = players.find(player => player.id === game.playerId);
                return {
                    ...player,
                    position: game.position,
                    points: game.points
                };
            });
            setOutPlayers(restoredOutPlayers);
            setLastUsedPosition(sortedOutPlayers.length);
            setPositions((prevPositions) => {
                const updatedPositions = { ...prevPositions };
                restoredOutPlayers.forEach((player) => {
                    updatedPositions[player.id] = player.position;
                });
                return updatedPositions;
            });
        }
    }, [stateRestored]);
    const handleStartGameConfiguration = (selectedTournament, blindDuration, selectedPlayers) => {
        setSelectedTournament(selectedTournament);
        setBlindDuration(blindDuration);
        setSelectedPLayers(selectedPlayers);
        setShowConfig(false);
        setShowReview(true);
    };
    const onStartGame = async () => {
        if (gameStarted) {
            alert("A game is already in progress.");
            return;
        }
        resetGameState();
        if (selectedPlayers.length < 4) {
            alert("You need at least 4 players to start a game.");
            return;
        }
        try {
            // Appeler directement l'API playerStats/start pour créer une nouvelle partie et les statistiques des joueurs
            const playerStatsResponse = await api.post("/playerStats/start", {
                players: selectedPlayers.map((player) => player.id),
            });
            if (playerStatsResponse.data?.playerStats) {
                const playerStats = playerStatsResponse.data.playerStats;
                setGames(playerStats);
                setSelectedPLayers(selectedPlayers);
                setGameStarted(true);
                postInitialGameState(); // Envoyer l'état initial du jeu
                toast("Game started successfully!");
            }
            else {
                throw new Error("Invalid playerStats format in API response.");
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Server response:", err.message);
                toast("Failed to start new game: " + err.message);
            }
            else {
                console.error("Unexpected error:", err);
                toast("An unexpected error occurred");
            }
        }
        setInitialPlayerCount(selectedPlayers.length);
    };
    useEffect(() => {
        if (gameStarted && !isEnding) {
            saveGameState(timeLeft);
        }
    }, [gameStarted, timeLeft, isEnding, outPlayers]);
    const confirmAndStartGame = async () => {
        setShowReview(false);
        await onStartGame();
        if (partyId) {
            navigate("/game");
        }
    };
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsxs("div", { children: ["Error: ", error] });
    }
    // const onStartGameReview = () => {
    //   setShowReview(true);
    // };
    const handleRebuy = (playerId) => {
        if (window.confirm("Is this player paid the rebuy?")) {
            setRebuyPlayerId(playerId);
            setKiller(true);
            setGames((prevGames) => prevGames.map((game) => game.playerId === playerId
                ? {
                    ...game,
                    rebuys: game.rebuys + 1,
                    totalCost: (game.totalCost ?? 0) + 5,
                }
                : game));
            setTotalStack((prevTotalStack) => prevTotalStack + 5350);
            setPot((prevPot) => prevPot + 4);
            saveGameState(timeLeft);
        }
        setSavedTotalStack(totalStack);
    };
    const handleOutOfGame = async (partyId, playerId, eliminatedById) => {
        if (window.confirm(`Is ${playerId} out of the game?`)) {
            setKiller(true);
            setPlayerOutGame(playerId);
            const gameIndex = games.findIndex((game) => game.playerId === playerId);
            if (gameIndex !== -1) {
                const game = games[gameIndex];
                const outAt = new Date();
                try {
                    const updatedGames = [...games];
                    updatedGames[gameIndex] = { ...game, outAt: outAt };
                    const sortedGames = updatedGames
                        .filter((g) => g.outAt)
                        .sort((a, b) => new Date(a.outAt).getTime() - new Date(b.outAt).getTime());
                    // Assurez-vous que gameIndex est valide et que sortedGames[gameIndex] existe
                    sortedGames.forEach((g, idx) => {
                        g.position = initialPlayerCount - idx;
                        g.points = idx + 1;
                    });
                    setGames(updatedGames);
                    setOutPlayers((prevOutPlayers) => {
                        const player = selectedPlayers.find((player) => player.id === playerId);
                        if (player) {
                            const playerWithPosition = {
                                ...player,
                                position: initialPlayerCount - sortedGames.length + 1,
                                points: sortedGames[gameIndex]?.points || 0 // Utilisez un fallback pour points
                            };
                            return [...prevOutPlayers, playerWithPosition];
                        }
                        return prevOutPlayers;
                    });
                    setSelectedPLayers((prevSelectedPlayers) => prevSelectedPlayers.filter((player) => player.id !== playerId));
                    setPositions((prevPositions) => ({ ...prevPositions, [playerId]: initialPlayerCount - sortedGames.length + 1 }));
                    saveGameState(timeLeft);
                    await api.put(`/gamesResults/${game.id}`, {
                        ...game,
                        points: sortedGames[gameIndex]?.points || 0, // Utilisez un fallback pour points
                        outAt: outAt.toISOString(),
                        position: initialPlayerCount - sortedGames.length + 1,
                    });
                    await api.put("/playerStats/eliminate", {
                        partyId,
                        playerId,
                        eliminatedById,
                        points: sortedGames[gameIndex]?.points || 0, // Utilisez un fallback pour points
                        position: initialPlayerCount - sortedGames.length + 1,
                    });
                }
                catch (error) {
                    console.error("An error occurred while updating player stats:", error);
                }
            }
        }
    };
    const handleGameEnd = async () => {
        if (games.filter((game) => !game.outAt).length === 1) {
            setIsEnding(true);
            const winningPlayerId = games.find((game) => !game.outAt)?.playerId;
            const updatedGames = games.map((game) => game.playerId === winningPlayerId
                ? { ...game, points: initialPlayerCount, outAt: new Date(), position: 1 }
                : game);
            try {
                console.log("Saving final results...");
                // Enregistrer les résultats finaux
                await api.post("/gameResults", updatedGames);
                updateAfterGameEnd(updatedGames);
                // Supprimer l'état du jeu sur le serveur
                const response = await fetch('https://api.bourlypokertour.fr/gameState', {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error("Failed to delete game state on server");
                }
                console.log('Game state deleted successfully from server');
                toast.success("Game ended successfully!");
                resetGameState(); // Réinitialiser l'état local
                setGameStarted(false);
                setPartyId(false);
                navigate("/results");
            }
            catch (error) {
                console.error("Error:", error);
                alert("Failed to end the game properly. Please try again.");
            }
        }
        else {
            alert("The game cannot be ended yet as more than one player is still playing.");
        }
        try {
            const response = await fetch(`https://api.bourlypokertour.fr/gameState`);
            console.log("API Response:", response);
            if (response.ok) {
                const response = await fetch('https://api.bourlypokertour.fr/gameState', {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error("Failed to delete game state on server");
                }
                console.log('Game state deleted successfully from server');
                toast.success("Game ended successfully!");
            }
        }
        catch (error) {
            console.error("Error:", error);
        }
        setIsEnding(false);
    };
    return (_jsxs("div", { style: {
            maxWidth: "100%",
            height: "100vh",
            margin: "auto",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column"
        }, children: [_jsx(KillerSelectionModal, { killer: killer, games: games, currentlyPlayingPlayers: selectedPlayers.filter((p) => !games.find((g) => g.playerId === p.id && g.outAt)), rebuyPlayerId: rebuyPlayerId, playerOutGame: playerOutGame, handlePlayerKillSelection: (killerPlayerId) => {
                    if (window.confirm("Do you want to select this player as the killer?")) {
                        setGames((prevGames) => prevGames.map((game) => game.playerId === killerPlayerId ? { ...game, kills: game.kills + 1 } : game));
                        setKiller(false);
                        setRebuyPlayerId(null);
                        saveGameState(timeLeft);
                    }
                } }), showConfig && (_jsx(GameConfiguration, { championnat: championnat, players: players, onStartGameConfiguration: handleStartGameConfiguration })), showReview && !partyId ? (_jsx(ReviewSelectedPlayers, { selectedPlayers: selectedPlayers, selectedTournament: selectedTournament, onConfirm: confirmAndStartGame })) : (_jsx("div", { style: { maxHeight: "90%" }, children: _jsx(Modal, { style: {
                        height: "100vh",
                        maxHeight: "100vh",
                        overflow: "auto"
                    }, isOpen: gameStarted, onClose: handleGameEnd, children: _jsxs("div", { style: {
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            maxHeight: "100vh"
                        }, children: [_jsx(ModalHeader, { style: {
                                    fontSize: "clamp(18px, 4vw, 28px)", // Responsive font size
                                    fontWeight: "bolder",
                                    color: isPaused ? "red" : "green",
                                }, children: isPaused ? "Game Paused" : "Game in Progress" }), _jsxs(ModalBody, { style: {
                                    overflow: "auto",
                                    flexGrow: 1,
                                    padding: "10px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "10px"
                                }, children: [_jsx(GameControls, { gameStarted: gameStarted, isPaused: isPaused, timeLeft: timeLeft, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, handleGameEnd: handleGameEnd, setIsPaused: setIsPaused, pot: pot, middleStack: middleStack, setSmallBlind: setSmallBlind, setBigBlind: setBigBlind, setAnte: setAnte, setTimeLeft: setTimeLeft, blindIndex: blindIndex, setBlindIndex: setBlindIndex, initialTimeLeft: timeLeft || initialTimeLeft }), selectedPlayers.length > 0 && games.length > 0 ? (_jsx(PlayerList, { players: selectedPlayers, games: games, handleRebuy: handleRebuy, handleOutOfGame: handleOutOfGame })) : (_jsx("div", { children: "Loading player data..." }))] })] }) }) }))] }));
};
export default StartGame;
