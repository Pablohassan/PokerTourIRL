import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import GameConfiguration from './GameConfiguration';
import ReviewSelectedPlayers from "../components/ReviewSelectedPlayers";
import GameControls from "./GameControls";
import PlayerList from "./PlayerList";
import KillerSelectionModal from "./KillerSelectionModal";
import useGameState from "./useGameState";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from '../config';
const StartGame = ({ championnat, selectedPlayers, setSelectedPLayers, players, updateAfterGameEnd, blindIndex, setBlindIndex }) => {
    const navigate = useNavigate();
    const [gameStarted, setGameStarted] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [showConfig, setShowConfig] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [blindDuration, setBlindDuration] = useState(20);
    const [playerOutGame, setPlayerOutGame] = useState(null);
    const [partyId, setPartyId] = useState(null);
    const [isEnding, setIsEnding] = useState(false);
    const initialTimeLeft = blindDuration * 60;
    const { timeLeft, setTimeLeft, smallBlind, setSmallBlind, bigBlind, setBigBlind, ante, setAnte, games, setGames, pot, setPot, middleStack, setSavedTotalStack, totalStack, setTotalStack, saveGameState, resetGameState, rebuyPlayerId, setRebuyPlayerId, killer, setKiller, stateRestored, postInitialGameState, loading, error, setPositions, 
    // outPlayers,
    setOutPlayers, setLastUsedPosition, initialPlayerCount, setInitialPlayerCount, } = useGameState(gameStarted, setGameStarted, selectedPlayers, setSelectedPLayers, blindIndex, setBlindIndex, initialTimeLeft);
    useEffect(() => {
        if (stateRestored) {
            setGameStarted(true);
            setShowConfig(false);
            const totalPlayers = initialPlayerCount;
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
    // Add new function to handle fullscreen
    const enableFullScreen = async () => {
        try {
            if (document.documentElement.requestFullscreen) {
                await document.documentElement.requestFullscreen();
            }
            else if (document.documentElement.webkitRequestFullscreen) {
                await document.documentElement.webkitRequestFullscreen();
            }
            else if (document.documentElement.msRequestFullscreen) {
                await document.documentElement.msRequestFullscreen();
            }
        }
        catch (error) {
            console.error('Error enabling fullscreen:', error);
        }
    };
    const onStartGame = async () => {
        if (gameStarted) {
            toast.error("A game is already in progress.");
            return;
        }
        // Enable fullscreen when starting the game
        await enableFullScreen();
        resetGameState();
        if (selectedPlayers.length < 4) {
            toast.error("You need at least 4 players to start a game.");
            return;
        }
        try {
            // First create the player stats
            const playerStatsResponse = await api.post("/playerStats/start", {
                players: selectedPlayers.map((player) => player.id),
            });
            if (!playerStatsResponse.data?.playerStats) {
                throw new Error("Invalid playerStats format in API response.");
            }
            // Update local state with player stats
            const playerStats = playerStatsResponse.data.playerStats;
            const newPartyId = playerStatsResponse.data.partyId;
            // Set party ID first to establish backend connection
            setPartyId(newPartyId);
            // Update local state
            setGames(playerStats);
            setSelectedPLayers(selectedPlayers);
            setInitialPlayerCount(selectedPlayers.length);
            // Calculate initial values
            const initialTotalStack = selectedPlayers.length * 5350;
            const initialPot = selectedPlayers.length * 5;
            setTotalStack(initialTotalStack);
            setPot(initialPot);
            // Create initial game state
            const gameState = {
                timeLeft: initialTimeLeft,
                smallBlind: 10,
                bigBlind: 20,
                ante: 0,
                games: playerStats,
                selectedPlayers,
                totalStack: initialTotalStack,
                pot: initialPot,
                middleStack: 5350,
                rebuyPlayerId: null,
                killer: false,
                blindIndex: 0,
                positions: {},
                outPlayers: [],
                lastSavedTime: Date.now(),
                initialPlayerCount: selectedPlayers.length,
                partyId: newPartyId // Include partyId in the state
            };
            // Post initial state
            await api.post(API_ENDPOINTS.GAME_STATE, {
                state: gameState,
                partyId: newPartyId // Include partyId in the request
            });
            // Verify state was saved
            const verifyState = await api.get(API_ENDPOINTS.GAME_STATE);
            if (!verifyState.data?.state) {
                throw new Error("Failed to verify game state");
            }
            // Mark state as posted only after verification
            await postInitialGameState();
            // Start the game
            setGameStarted(true);
            toast.success("Game started successfully!");
            // Force a state refresh to ensure sync
            const refreshState = await api.get(API_ENDPOINTS.GAME_STATE);
            if (refreshState.data?.state) {
                setGames(refreshState.data.state.games);
                setPot(refreshState.data.state.pot);
                setTotalStack(refreshState.data.state.totalStack);
            }
        }
        catch (err) {
            if (err instanceof Error) {
                console.error("Server response:", err.message);
                toast.error("Failed to start new game: " + err.message);
            }
            else {
                console.error("Unexpected error:", err);
                toast.error("An unexpected error occurred");
            }
            // Clean up on error
            setGameStarted(false);
            setPartyId(null);
            resetGameState();
            return;
        }
    };
    useEffect(() => {
        if (gameStarted && !isEnding && timeLeft % 10 === 0) { // Only save every 10 seconds
            saveGameState(timeLeft);
        }
    }, [gameStarted, timeLeft, isEnding]);
    const confirmAndStartGame = async () => {
        setShowReview(false);
        await onStartGame();
    };
    const handleRebuy = (playerId) => {
        console.log('handleRebuy called for player:', playerId);
        if (window.confirm("Is this player paid the rebuy?")) {
            // First update the game state for the rebuy
            setGames((prevGames) => prevGames.map((game) => game.playerId === playerId
                ? {
                    ...game,
                    rebuys: game.rebuys + 1,
                    totalCost: (game.totalCost ?? 0) + 5,
                }
                : game));
            setTotalStack((prevTotalStack) => prevTotalStack + 5350);
            setPot((prevPot) => prevPot + 4);
            setSavedTotalStack(totalStack);
            // Then trigger killer selection
            console.log('Setting rebuyPlayerId and killer state');
            setRebuyPlayerId(playerId);
            setKiller(true);
        }
    };
    const handleOutOfGame = async (partyId, playerId) => {
        console.log('handleOutOfGame called for player:', playerId, 'in party:', partyId);
        const playerName = selectedPlayers.find(p => p.id === playerId)?.name;
        if (window.confirm(`Is ${playerName} out of the game?`)) {
            try {
                // First trigger killer selection
                console.log('Setting playerOutGame and killer state');
                setPlayerOutGame(playerId);
                setKiller(true);
            }
            catch (error) {
                console.error('Error in handleOutOfGame:', error);
                toast.error('Failed to process player elimination');
            }
        }
    };
    const handlePlayerKillSelection = async (killerPlayerId) => {
        console.log('handlePlayerKillSelection called with killer:', killerPlayerId);
        if (window.confirm("Do you want to select this player as the killer?")) {
            try {
                // If this was from an elimination, process the elimination
                if (playerOutGame) {
                    console.log('Processing elimination for player:', playerOutGame);
                    const gameIndex = games.findIndex((game) => game.playerId === playerOutGame);
                    if (gameIndex !== -1) {
                        const game = games[gameIndex];
                        const outAt = new Date();
                        try {
                            // First update backend to ensure data consistency
                            const gameResult = await api.put(`/gamesResults/${game.id}`, {
                                ...game,
                                outAt: outAt.toISOString(),
                                position: initialPlayerCount - games.filter(g => g.outAt).length,
                                points: games.filter(g => g.outAt).length + 1
                            });
                            // Get the party ID from the game result
                            const currentPartyId = gameResult.data?.partyId || game.partyId;
                            await api.put("/playerStats/eliminate", {
                                partyId: currentPartyId,
                                playerId: playerOutGame,
                                eliminatedById: killerPlayerId,
                                points: games.filter(g => g.outAt).length + 1,
                                position: initialPlayerCount - games.filter(g => g.outAt).length
                            });
                            // Then update local state
                            const updatedGames = [...games];
                            updatedGames[gameIndex] = {
                                ...game,
                                outAt,
                                position: initialPlayerCount - games.filter(g => g.outAt).length,
                                points: games.filter(g => g.outAt).length + 1
                            };
                            // Update killer's stats in the same update
                            updatedGames.forEach((game, idx) => {
                                if (game.playerId === killerPlayerId) {
                                    updatedGames[idx] = {
                                        ...game,
                                        kills: game.kills + 1
                                    };
                                }
                            });
                            setGames(updatedGames);
                            // Update out players list
                            const player = selectedPlayers.find((p) => p.id === playerOutGame);
                            if (player) {
                                const playerWithPosition = {
                                    ...player,
                                    position: initialPlayerCount - games.filter(g => g.outAt).length,
                                    points: games.filter(g => g.outAt).length + 1
                                };
                                setOutPlayers(prev => [...prev, playerWithPosition]);
                            }
                            // Remove player from selected players
                            setSelectedPLayers(prev => prev.filter(p => p.id !== playerOutGame));
                            // Update positions
                            setPositions(prev => ({
                                ...prev,
                                [playerOutGame]: initialPlayerCount - games.filter(g => g.outAt).length
                            }));
                            // Save the game state
                            await saveGameState(timeLeft);
                            toast.success(`Player eliminated and killer's stats updated!`);
                        }
                        catch (error) {
                            console.error('Error updating backend:', error);
                            throw new Error('Failed to update player elimination in backend');
                        }
                    }
                }
                else {
                    // If this was just a rebuy, update killer's stats and save
                    setGames((prevGames) => prevGames.map((game) => game.playerId === killerPlayerId ? { ...game, kills: game.kills + 1 } : game));
                    await saveGameState(timeLeft);
                }
                // Reset modal state
                setKiller(false);
                setPlayerOutGame(null);
                setRebuyPlayerId(null);
            }
            catch (error) {
                console.error("Error in handlePlayerKillSelection:", error);
                toast.error("Failed to update player stats. Please try again.");
                // Reset states on error
                setKiller(false);
                setPlayerOutGame(null);
                setRebuyPlayerId(null);
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
                await api.post("/gameResults", updatedGames);
                updateAfterGameEnd(updatedGames);
                const response = await fetch(API_ENDPOINTS.GAME_STATE, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error("Failed to delete game state on server");
                }
                toast.success("Game ended successfully!");
                resetGameState();
                setGameStarted(false);
                setPartyId(null);
                navigate("/results");
            }
            catch (error) {
                console.error("Error:", error);
                toast.error("Failed to end the game properly. Please try again.");
            }
        }
        else {
            toast.error("The game cannot be ended yet as more than one player is still playing.");
        }
        setIsEnding(false);
    };
    // Add debug logging at the start of the render function
    console.log('StartGame render state:', {
        gameStarted,
        showConfig,
        showReview,
        loading,
        error,
        selectedPlayers: selectedPlayers.length,
        games: games.length
    });
    if (loading) {
        return (_jsx("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }, children: _jsx("div", { style: { fontSize: '1.25rem' }, children: "Loading game state..." }) }));
    }
    if (error) {
        return (_jsx("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }, children: _jsxs("div", { style: { fontSize: '1.25rem', color: '#ef4444' }, children: ["Error: ", error] }) }));
    }
    // Add debug logging before returning the main UI
    console.log('StartGame main UI render:', {
        showingConfig: showConfig,
        showingReview: showReview && !partyId,
        showingGameModal: gameStarted,
        hasPlayers: selectedPlayers.length > 0 && games.length > 0
    });
    // Add useEffect to handle screen orientation
    useEffect(() => {
        if (gameStarted) {
            // Lock to portrait orientation if possible
            if ('screen' in window && 'orientation' in screen) {
                screen.orientation.lock?.('portrait').catch((err) => {
                    console.error('Failed to lock screen orientation:', err);
                });
            }
        }
    }, [gameStarted]);
    return (_jsxs("div", { style: {
            height: '100vh',
            maxWidth: '100%',
            margin: 'auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        }, children: [_jsx(KillerSelectionModal, { killer: killer, games: games, currentlyPlayingPlayers: selectedPlayers.filter((p) => !games.find((g) => g.playerId === p.id && g.outAt)), rebuyPlayerId: rebuyPlayerId, playerOutGame: playerOutGame, handlePlayerKillSelection: handlePlayerKillSelection }), showConfig && (_jsx(GameConfiguration, { championnat: championnat, players: players, onStartGameConfiguration: handleStartGameConfiguration })), showReview && !partyId && (_jsx(ReviewSelectedPlayers, { selectedPlayers: selectedPlayers, selectedTournament: selectedTournament, onConfirm: confirmAndStartGame })), gameStarted && (_jsxs("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#ffffff',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }, children: [_jsxs("div", { style: {
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: '#ffffff',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '16px'
                        }, children: [_jsxs("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }, children: [_jsx("h1", { style: {
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: isPaused ? "red" : "green",
                                            margin: 0
                                        }, children: isPaused ? "Game Paused" : "Game in Progress" }), _jsx("div", { style: {
                                            display: 'flex',
                                            gap: '8px'
                                        } })] }), _jsxs("div", { style: {
                                    display: 'flex',
                                    gap: '8px'
                                }, children: [_jsx("button", { onClick: () => {
                                            if (window.confirm('TU va reinitialiser la partie, toutes les données seront perdues tu vlide?')) {
                                                resetGameState();
                                                setGameStarted(false);
                                                setShowConfig(true);
                                                toast.success('Game state reset successfully!');
                                            }
                                        }, style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#f59e0b',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }, children: "Reset Game" }), _jsx("button", { onClick: handleGameEnd, style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#ef4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }, children: "End Game" })] })] }), _jsxs("div", { style: {
                            flexGrow: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            backgroundColor: '#ffffff'
                        }, children: [_jsx(GameControls, { gameStarted: gameStarted, isPaused: isPaused, timeLeft: timeLeft, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, handleGameEnd: handleGameEnd, setIsPaused: setIsPaused, pot: pot, middleStack: middleStack, setSmallBlind: setSmallBlind, setBigBlind: setBigBlind, setAnte: setAnte, setTimeLeft: setTimeLeft, blindIndex: blindIndex, setBlindIndex: setBlindIndex, initialTimeLeft: timeLeft || initialTimeLeft, style: {
                                    width: '100%',
                                    maxWidth: '100%',
                                    position: 'sticky',
                                    top: 0,
                                    backgroundColor: '#ffffff',
                                    zIndex: 1
                                } }), selectedPlayers.length > 0 && games.length > 0 ? (_jsx("div", { style: {
                                    width: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '16px',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    zIndex: 0
                                }, children: _jsx(PlayerList, { players: selectedPlayers, games: games, handleRebuy: handleRebuy, handleOutOfGame: (partyId, playerId) => handleOutOfGame(partyId, playerId) }) })) : (_jsx("div", { style: {
                                    textAlign: 'center',
                                    padding: '16px',
                                    color: '#6b7280'
                                }, children: "Loading player data..." }))] })] }))] }));
};
export default StartGame;
