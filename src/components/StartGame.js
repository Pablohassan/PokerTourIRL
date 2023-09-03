import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import SelectPlayersGame from "./SelectPlayersGame";
import { Content } from './Content';
import ReviewSelectedPlayers from "../components/ReviewSelectedPlayers";
import { Modal, Button, ModalHeader, ModalBody, ModalContent, ButtonGroup, } from "@nextui-org/react";
import { CardPlayer } from "./CardPlayer";
import BlindTimer from "./BlindTimer";
import toast from "react-hot-toast";
const StartGame = ({ championnat, selectedPlayers, setSelectedPLayers, handlePlayerSelect, players, updateAfterGameEnd, }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [games, setGames] = useState([]);
    const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
    const [smallBlind, setSmallBlind] = useState(10);
    const [bigBlind, setBigBlind] = useState(20);
    const [outPlayers, setOutPlayers] = useState([]);
    const [initialPlayerCount, setInitialPlayerCount] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [playerOutGame, setPlayerOutGame] = useState(null);
    const [killer, setKiller] = useState(false);
    const [isSelectPlayersModalOpen, setIsSelectPlayersModalOpen] = useState(true);
    const [rebuyPlayerId, setRebuyPlayerId] = useState(null);
    const [partyStarted, setPartyStarted] = useState(null);
    const [currentParty, setCurrentParty] = useState(null);
    const [partyId, setPartyId] = useState(false);
    const [partyEnded, setPartyEnded] = useState(null);
    useEffect(() => {
        const restoreState = async () => {
            // If the game is not started, try to restore the state
            if (!gameStarted) {
                // Fetch data from your API or localStorage
                const savedState = localStorage.getItem('gameState');
                if (savedState) {
                    const { timeLeft, smallBlind, bigBlind, killer, rebuyPlayerId, games, outPlayers, initialPlayerCount, selectedTournamentId, partyStarted, showReview } = JSON.parse(savedState);
                    setTimeLeft(timeLeft);
                    setSmallBlind(smallBlind);
                    setBigBlind(bigBlind);
                    setGames(games);
                    setKiller(killer);
                    setRebuyPlayerId(rebuyPlayerId);
                    setOutPlayers(outPlayers);
                    setInitialPlayerCount(initialPlayerCount);
                    setSelectedTournamentId(selectedTournamentId);
                    setPartyStarted(partyStarted);
                    // ...set other state variables
                    setGameStarted(true); // Now, the game is restored
                    setShowReview(showReview);
                }
            }
        };
        restoreState();
    }, []);
    useEffect(() => {
        if (partyId !== false) {
            // Replace `partyId` with the actual party ID you want to check
            const fetchPartyState = async () => {
                try {
                    const response = await api.get(`/parties/state/${partyId}`);
                    const { partyStarted, partyEnded } = response.data;
                    setPartyStarted(partyStarted);
                    setPartyEnded(partyEnded);
                }
                catch (error) {
                    console.error('Failed to fetch party state:', error);
                }
            };
            fetchPartyState();
        }
    }, [partyId]);
    useEffect(() => {
        const fetchCurrentParty = async () => {
            try {
                const response = await api.get("/api/currentParty"); // <-- Replace with your actual API endpoint
                const data = await response.data;
                if (data && data.id) {
                    setCurrentParty(data);
                    setGameStarted(true);
                }
            }
            catch (err) {
                console.error("Error fetching current party:", err);
            }
        };
        fetchCurrentParty();
    }, []);
    const navigate = useNavigate();
    const onStartGameReview = () => {
        setShowReview(true);
    };
    const confirmAndStartGame = async () => {
        setShowReview(false); // Hide the review
        await onStartGame(); // Now, start the game
    };
    const noTournaments = championnat.length === 0;
    const onStartGame = async () => {
        if (gameStarted) {
            // If a game is already started, don't start a new game.
            alert('A game is already in progress.');
            return;
        }
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
        const gameState = {
            timeLeft,
            smallBlind,
            bigBlind,
            killer,
            rebuyPlayerId,
            games,
            outPlayers,
            initialPlayerCount,
            selectedTournamentId,
            partyStarted,
            showReview
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
        // setSelectPlayersModalOpen(false);
    };
    const handleRebuy = (playerId) => {
        if (window.confirm("Is this player payed the rebuy?")) {
            setRebuyPlayerId(playerId);
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
    const updateKiller = async (killerPlayerId, partyId) => {
        setGames((prevGames) => prevGames.map((game) => game.playerId === killerPlayerId
            ? { ...game, kills: game.kills + 1 }
            : game));
        setKiller(false); // Close the modal for selecting the killer
        // Any other logic that you need to add for the killer
    };
    const handlePlayerKillSelection = async (killerPlayerId, partyId) => {
        if (window.confirm("Do you want to select this player as the killer?")) {
            await updateKiller(killerPlayerId, partyId);
        }
    };
    const handleOutOfGame = async (partyId, playerId, eliminatedById) => {
        console.log("Player ID clicked for Out of Game:", playerId);
        if (eliminatedById !== null || window.confirm(`Is ${playerId} out of the game?`)) {
            setKiller(true);
            setPlayerOutGame(playerId);
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
                        newGames[gameIndex] = {
                            ...game,
                            points: points,
                            outAt: outAt,
                            position: position,
                        };
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
            try {
                const res = await api.post("/gameResults", updatedGames);
                updateAfterGameEnd(updatedGames);
            }
            catch (error) {
                console.error("Error:", error);
            }
            setGameStarted(false);
            setPartyId(false);
            localStorage.removeItem('gameState');
            navigate("/results");
        }
    };
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
    return (_jsxs("div", { className: "", children: [_jsx(BlindTimer, { gameStarted: gameStarted, isPaused: isPaused, 
                // Handle the blind change here
                onBlindChange: (small, big) => {
                    setSmallBlind(small);
                    setBigBlind(big);
                }, onTimeChange: (time) => {
                    // Handle time change here
                    setTimeLeft(time);
                } }), _jsx(Modal, { isOpen: killer, children: _jsxs(ModalContent, { children: [_jsx(ModalHeader, { className: "with-full height-full", children: "Select a Killer" }), _jsx(ModalBody, { children: _jsx("div", { color: "danger", children: games &&
                                    games.map((game) => {
                                        const player = currentlyPlayingPlayers.find((p) => p?.id === game.playerId);
                                        if (player && !game.outAt && player.id !== rebuyPlayerId && player.id !== playerOutGame) {
                                            return (_jsx(ButtonGroup, { style: { padding: "2px" }, children: _jsx(Button, { variant: "bordered", color: "warning", className: "text-lg p-2 m-1", onClick: () => handlePlayerKillSelection(player.id, game.partyId), children: player.name }, player.id) }));
                                        }
                                        else {
                                            return null; // Si le joueur n'est pas trouvé ou est "out", ne rien retourner
                                        }
                                    }) }) })] }) }), _jsxs(Modal, { isOpen: !gameStarted && !currentParty, children: [_jsx(ModalHeader, { children: "Select Players and Game Details" }), _jsx(ModalBody, { children: _jsx(Modal, { isOpen: isSelectPlayersModalOpen, children: _jsx(SelectPlayersGame, { players: players, selectedPlayers: selectedPlayers, handlePlayerSelect: handlePlayerSelect, onStartGame: onStartGameReview, championnat: championnat, selectedTournamentId: selectedTournamentId, setSelectedTournamentId: setSelectedTournamentId }) }) })] }), showReview && !partyId ? (_jsx(ReviewSelectedPlayers, { selectedPlayers: selectedPlayers, onConfirm: confirmAndStartGame })) : (_jsxs("div", { children: [" ", _jsxs(Modal, { isOpen: gameStarted, onClose: handleGameEnd, children: [_jsx(ModalHeader, { className: "text-xl bg-color-red", children: "Game in Progress" }), _jsx(Content, { championnat: championnat }), _jsx(ModalBody, { children: _jsxs("div", { style: {
                                        margin: "10 auto",
                                        // display: "flex",
                                        // justifyContent: "center",
                                    }, children: [gameStarted && (_jsxs("div", { className: "max-w-sm flex flex-col border-3 border-black rounded-md", children: [_jsxs("div", { className: "w-4/5 p-5 flex sm:flex-col md:flex-row justify-between items-center border-dotted border-x-2 border-black", children: [_jsxs("div", { className: "text-xl font-digital-7", children: ["Time left: ", formatTime(timeLeft)] }), _jsxs("div", { className: "text-xl bg-slate-900", children: ["Small: ", smallBlind, " / Big :", bigBlind] })] }), _jsxs("div", { className: "flex flex-row justify-center space-x-4 items-center", children: [_jsx("div", { className: "p-4", children: _jsx(Button, { color: "danger", className: "text-white", onClick: handleGameEnd, children: "Stop Partie" }) }), _jsx("div", { children: _jsx(Button, { className: "p-4", color: "warning", onClick: () => setIsPaused(!isPaused), children: isPaused ? "Resume" : "Pause" }) })] })] })), _jsx("div", { style: {
                                                display: "flex",
                                                flexDirection: "row",
                                                flexWrap: "wrap",
                                            }, children: currentlyPlayingPlayers.map((player) => {
                                                // Trouver le jeu correspondant au joueur actuel
                                                const gameForPlayer = games.find((game) => game.playerId === player?.id);
                                                // Si le jeu existe pour ce joueur, affichez les détails, sinon affichez une erreur
                                                return (_jsx("div", { style: { display: "flex", flexDirection: "column", }, children: gameForPlayer ? (_jsx("div", { className: "p-1", children: _jsx(CardPlayer, { playername: player?.name ?? " none", recave: gameForPlayer.rebuys, kill: gameForPlayer.kills, rebuy: () => handleRebuy(gameForPlayer.playerId), outOfGame: () => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById) }) })) : (_jsxs("div", { children: ["Erreur: Pas de jeu pour ", player?.name] })) }, player?.id));
                                            }) })] }) })] })] }))] }));
};
export default StartGame;
//# sourceMappingURL=StartGame.js.map