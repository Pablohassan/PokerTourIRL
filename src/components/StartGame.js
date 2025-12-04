import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import EditGameStateModal from './EditGameStateModal';
import { Button } from "./ui/button";
import ConfirmDialog from "./ui/confirm-dialog";
import WinnerModal from "./ui/winner-modal";
import killSfx from "../assets/kill.mp3";
import ogreSfx from "../assets/ogre.mp3";
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRebuyConfirm, setShowRebuyConfirm] = useState(false);
    const [pendingRebuyPlayerId, setPendingRebuyPlayerId] = useState(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);
    const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
    const [pendingEliminateData, setPendingEliminateData] = useState(null);
    const [showKillerConfirm, setShowKillerConfirm] = useState(false);
    const [pendingKillerId, setPendingKillerId] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [winnerPlayer, setWinnerPlayer] = useState(null);
    const [winnerTimeout, setWinnerTimeout] = useState(null);
    const killSoundTimeout = useRef(null);
    const killAudioRef = useRef(null);
    const rebuySoundTimeout = useRef(null);
    const rebuyAudioRef = useRef(null);
    const blinds = [
        { small: 10, big: 20, ante: 0 },
        { small: 25, big: 50, ante: 0 },
        { small: 50, big: 100, ante: 0 },
        { small: 100, big: 200, ante: 0 },
        { small: 150, big: 300, ante: 0 },
        { small: 200, big: 400, ante: 10 },
        { small: 250, big: 500, ante: 10 },
        { small: 300, big: 600, ante: 25 },
        { small: 400, big: 800, ante: 25 },
        { small: 500, big: 1000, ante: 50 },
        { small: 600, big: 1200, ante: 50 },
        { small: 700, big: 1400, ante: 100 },
        { small: 800, big: 1600, ante: 100 },
        { small: 900, big: 1800, ante: 200 },
        { small: 1000, big: 2000, ante: 200 },
        { small: 1200, big: 2400, ante: 300 },
        { small: 1400, big: 2800, ante: 300 },
        { small: 1600, big: 3200, ante: 400 },
        { small: 1800, big: 3600, ante: 400 },
        { small: 2000, big: 4000, ante: 500 },
        { small: 2200, big: 4400, ante: 500 },
        { small: 2500, big: 5000, ante: 500 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3500, big: 7000, ante: 1000 },
        { small: 4000, big: 8000, ante: 2000 },
        { small: 5000, big: 10000, ante: 2000 },
        { small: 6000, big: 12000, ante: 3000 },
        { small: 7000, big: 14000, ante: 3000 },
        { small: 8000, big: 16000, ante: 4000 },
        { small: 9000, big: 18000, ante: 4000 },
        { small: 10000, big: 20000, ante: 5000 },
    ];
    const { timeLeft, setTimeLeft, smallBlind, setSmallBlind, bigBlind, setBigBlind, ante, setAnte, games, setGames, pot, setPot, middleStack, setSavedTotalStack, totalStack, setTotalStack, saveGameState, resetGameState, rebuyPlayerId, setRebuyPlayerId, killer, setKiller, stateRestored, currentBlindDuration, setCurrentBlindDuration, loading, error, setPositions, outPlayers, setOutPlayers, setLastUsedPosition, initialPlayerCount, setInitialPlayerCount, postInitialGameState, gameEnded, setGameEnded, } = useGameState(gameStarted, setGameStarted, selectedPlayers, setSelectedPLayers, blindIndex, setBlindIndex, blindDuration);
    const totalRebuys = useMemo(() => {
        return games.reduce((sum, game) => {
            if (partyId && game.partyId !== partyId) {
                return sum;
            }
            return sum + (game.rebuys || 0);
        }, 0);
    }, [games, partyId]);
    const queueKillSound = useCallback(() => {
        if (killSoundTimeout.current) {
            clearTimeout(killSoundTimeout.current);
        }
        killSoundTimeout.current = setTimeout(() => {
            try {
                if (!killAudioRef.current) {
                    killAudioRef.current = new Audio(killSfx);
                }
                else {
                    killAudioRef.current.currentTime = 0;
                }
                killAudioRef.current.play().catch((err) => {
                    console.warn('Unable to play kill sound:', err);
                });
            }
            catch (err) {
                console.warn('Kill sound error:', err);
            }
        }, 5000);
    }, []);
    const queueRebuySound = useCallback(() => {
        if (rebuySoundTimeout.current) {
            clearTimeout(rebuySoundTimeout.current);
        }
        rebuySoundTimeout.current = setTimeout(() => {
            try {
                if (!rebuyAudioRef.current) {
                    rebuyAudioRef.current = new Audio(ogreSfx);
                }
                else {
                    rebuyAudioRef.current.currentTime = 0;
                }
                rebuyAudioRef.current.play().catch((err) => {
                    console.warn('Unable to play rebuy sound:', err);
                });
            }
            catch (err) {
                console.warn('Rebuy sound error:', err);
            }
        }, 150000);
    }, []);
    const updateBlinds = useCallback(() => {
        try {
            const nextIndex = blindIndex + 1;
            if (nextIndex >= blinds.length) {
                toast.error("Maximum blind level reached!");
                return;
            }
            const { small, big, ante } = blinds[nextIndex];
            setSmallBlind(small);
            setBigBlind(big);
            setAnte(ante);
            setBlindIndex(nextIndex);
            toast.success("Blinds updated successfully!");
        }
        catch (error) {
            console.error('Error updating blinds:', error);
            toast.error('Failed to update blinds');
        }
    }, [blindIndex, setSmallBlind, setBigBlind, setAnte, setBlindIndex]);
    useEffect(() => {
        if (stateRestored && currentBlindDuration) {
            setBlindDuration(currentBlindDuration);
        }
    }, [stateRestored, currentBlindDuration]);
    useEffect(() => {
        if (gameStarted) {
            if ('screen' in window && 'orientation' in screen) {
                screen.orientation.lock?.('landscape').catch((err) => {
                    console.error('Failed to lock screen orientation:', err);
                });
            }
        }
    }, [gameStarted]);
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
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            if (killSoundTimeout.current) {
                clearTimeout(killSoundTimeout.current);
            }
            if (killAudioRef.current) {
                killAudioRef.current.pause();
            }
            if (rebuySoundTimeout.current) {
                clearTimeout(rebuySoundTimeout.current);
            }
            if (rebuyAudioRef.current) {
                rebuyAudioRef.current.pause();
            }
        };
    }, []);
    // Detect when only one player remains and show winner modal, then auto-end game
    useEffect(() => {
        if (gameStarted && !gameEnded && !isEnding && !showWinnerModal && games.length > 0) {
            const remainingPlayers = selectedPlayers.filter(player => {
                const game = games.find(game => game.playerId === player.id);
                const isOut = game && game.outAt;
                return !isOut;
            });
            if (remainingPlayers.length === 1) {
                const winner = remainingPlayers[0];
                setWinnerPlayer(winner);
                setShowWinnerModal(true);
                // Auto-trigger game end after 30 seconds to show the modal
                const timeout = setTimeout(() => {
                    setShowWinnerModal(false);
                    handleGameEnd();
                    setWinnerTimeout(null);
                }, 30000); // 30 seconds delay to show congratulations
                setWinnerTimeout(timeout);
            }
        }
    }, [gameStarted, gameEnded, isEnding, selectedPlayers, games, showWinnerModal]);
    // Additional effect specifically triggered by games updates (for immediate detection)
    useEffect(() => {
        if (gameStarted && !gameEnded && !isEnding && games.length > 0) {
            const playersWithOutAt = games.filter(g => g.outAt).length;
            const totalPlayers = games.length;
            if (totalPlayers - playersWithOutAt === 1 && !showWinnerModal) {
                const winnerGame = games.find(g => !g.outAt);
                if (winnerGame) {
                    const winner = selectedPlayers.find(p => p.id === winnerGame.playerId);
                    if (winner) {
                        setWinnerPlayer(winner);
                        setShowWinnerModal(true);
                        // Auto-trigger game end after showing the modal for 30 seconds
                        const timeout = setTimeout(() => {
                            setShowWinnerModal(false);
                            handleGameEnd();
                            setWinnerTimeout(null);
                        }, 30000);
                        setWinnerTimeout(timeout);
                    }
                }
            }
        }
    }, [games, gameStarted, gameEnded, isEnding, showWinnerModal, selectedPlayers]);
    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
            else {
                await document.exitFullscreen();
            }
        }
        catch (error) {
            console.error('Error toggling fullscreen:', error);
            toast.error('Failed to toggle fullscreen mode');
        }
    };
    const handleStartGameConfiguration = (selectedTournament, blindDuration, selectedPlayers) => {
        setSelectedTournament(selectedTournament);
        setBlindDuration(blindDuration);
        setSelectedPLayers(selectedPlayers);
        setShowConfig(false);
        setShowReview(true);
    };
    const onStartGame = async () => {
        if (gameStarted) {
            toast.error("A game is already in progress.");
            return;
        }
        await toggleFullscreen();
        // Ensure game ended flag is reset for new game
        setGameEnded(false);
        setShowWinnerModal(false);
        setWinnerPlayer(null);
        if (winnerTimeout) {
            clearTimeout(winnerTimeout);
            setWinnerTimeout(null);
        }
        resetGameState(blindDuration);
        if (selectedPlayers.length < 4) {
            toast.error("You need at least 4 players to start a game.");
            return;
        }
        try {
            const playerStatsResponse = await api.post("/playerStats/start", {
                players: selectedPlayers.map((player) => player.id),
            });
            if (!playerStatsResponse.data?.playerStats) {
                throw new Error("Invalid playerStats format in API response.");
            }
            const playerStats = playerStatsResponse.data.playerStats;
            const newPartyId = playerStatsResponse.data.partyId;
            setPartyId(newPartyId);
            setGames(playerStats);
            setSelectedPLayers(selectedPlayers);
            setInitialPlayerCount(selectedPlayers.length);
            const initialTotalStack = selectedPlayers.length * 5350;
            const initialPot = selectedPlayers.length * 5;
            setTotalStack(initialTotalStack);
            setPot(initialPot);
            const gameState = {
                timeLeft: blindDuration * 60,
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
                partyId: newPartyId,
                currentBlindDuration: blindDuration,
            };
            await api.post(API_ENDPOINTS.GAME_STATE, {
                state: gameState,
                partyId: newPartyId
            });
            const verifyState = await api.get(API_ENDPOINTS.GAME_STATE);
            if (!verifyState.data?.state) {
                throw new Error("Failed to verify game state");
            }
            await postInitialGameState();
            setGameStarted(true);
            toast.success("Game started successfully!");
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
            setGameStarted(false);
            setPartyId(null);
            resetGameState();
            return;
        }
    };
    useEffect(() => {
        if (gameStarted && !isEnding && !gameEnded && timeLeft % 10 === 0) {
            saveGameState(timeLeft);
        }
    }, [gameStarted, timeLeft, isEnding, gameEnded]);
    const confirmAndStartGame = async () => {
        setShowReview(false);
        await onStartGame();
    };
    const handleRebuy = (playerId) => {
        setPendingRebuyPlayerId(playerId);
        setShowRebuyConfirm(true);
    };
    const confirmRebuy = () => {
        if (pendingRebuyPlayerId === null)
            return;
        setGames((prevGames) => prevGames.map((game) => game.playerId === pendingRebuyPlayerId
            ? {
                ...game,
                rebuys: game.rebuys + 1,
                totalCost: (game.totalCost ?? 0) + 5,
            }
            : game));
        queueRebuySound();
        setTotalStack((prevTotalStack) => prevTotalStack + 5350);
        setPot((prevPot) => prevPot + 4);
        setSavedTotalStack(totalStack);
        setRebuyPlayerId(pendingRebuyPlayerId);
        setKiller(true);
        setPendingRebuyPlayerId(null);
    };
    const handleOutOfGame = async (partyId, playerId) => {
        const playerName = selectedPlayers.find(p => p.id === playerId)?.name;
        setPendingEliminateData({ playerId, partyId, playerName: playerName || '' });
        setShowEliminateConfirm(true);
    };
    const confirmElimination = async () => {
        if (!pendingEliminateData)
            return;
        if (selectedPlayers.length < 2) {
            toast.error("CLICKEZ SUR END GAME POUR TERMINER LA PARTIE.");
            return;
        }
        try {
            setPlayerOutGame(pendingEliminateData.playerId);
            setKiller(true);
        }
        catch (error) {
            console.error('Error in handleOutOfGame:', error);
            toast.error('Failed to process player elimination');
        }
        finally {
            setPendingEliminateData(null);
        }
    };
    const handlePlayerKillSelection = async (killerPlayerId) => {
        setPendingKillerId(killerPlayerId);
        setShowKillerConfirm(true);
    };
    const confirmKillerSelection = async () => {
        const killerPlayerId = pendingKillerId;
        if (!killerPlayerId)
            return;
        try {
            if (playerOutGame) {
                const gameIndex = games.findIndex((game) => game.playerId === playerOutGame);
                if (gameIndex !== -1) {
                    const game = games[gameIndex];
                    const outAt = new Date();
                    try {
                        const outPlayersCount = games.filter(g => g.outAt).length;
                        const position = initialPlayerCount - outPlayersCount;
                        const points = outPlayersCount + 1;
                        const gameResult = await api.put(`/gamesResults/${game.id}`, {
                            ...game,
                            outAt: outAt.toISOString(),
                            position,
                            points
                        });
                        const currentPartyId = gameResult.data?.partyId || game.partyId;
                        await api.put("/playerStats/eliminate", {
                            partyId: currentPartyId,
                            playerId: playerOutGame,
                            eliminatedById: killerPlayerId,
                            points,
                            position
                        });
                        const updatedGames = [...games];
                        updatedGames[gameIndex] = {
                            ...game,
                            outAt,
                            position,
                            points
                        };
                        updatedGames.forEach((game, idx) => {
                            if (game.playerId === killerPlayerId) {
                                updatedGames[idx] = {
                                    ...game,
                                    kills: (game.kills || 0) + 1
                                };
                            }
                        });
                        setGames(updatedGames);
                        queueKillSound();
                        const player = selectedPlayers.find((p) => p.id === playerOutGame);
                        if (player) {
                            const playerWithPosition = {
                                ...player,
                                position,
                                points
                            };
                            setOutPlayers(prev => [...prev, playerWithPosition]);
                        }
                        setSelectedPLayers(prev => prev.filter(p => p.id !== playerOutGame));
                        setPositions(prev => ({
                            ...prev,
                            [playerOutGame]: position
                        }));
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
                setGames((prevGames) => prevGames.map((game) => game.playerId === killerPlayerId ? { ...game, kills: (game.kills || 0) + 1 } : game));
                queueKillSound();
                await saveGameState(timeLeft);
            }
            setKiller(false);
            setPlayerOutGame(null);
            setRebuyPlayerId(null);
            setPendingKillerId(null);
        }
        catch (error) {
            console.error("Error in handlePlayerKillSelection:", error);
            toast.error("Failed to update player stats. Please try again.");
            setKiller(false);
            setPlayerOutGame(null);
            setRebuyPlayerId(null);
            setPendingKillerId(null);
        }
    };
    const handleGameEnd = async () => {
        if (games.filter((game) => !game.outAt).length === 1) {
            setIsEnding(true);
            // Mark game as ended FIRST to stop all state saving
            setGameEnded(true);
            const winningPlayerId = games.find((game) => !game.outAt)?.playerId;
            const updatedGames = games.map((game) => game.playerId === winningPlayerId
                ? { ...game, points: initialPlayerCount, outAt: new Date(), position: 1 }
                : game);
            try {
                // Stop the game first
                setGameStarted(false);
                // Delete game state before posting results to prevent race conditions
                await api.delete(API_ENDPOINTS.GAME_STATE);
                // Wait a bit to ensure state deletion is processed
                await new Promise(resolve => setTimeout(resolve, 500));
                // Then post game results
                await api.post("/gameResults", updatedGames);
                updateAfterGameEnd(updatedGames);
                toast.success("Game ended successfully!");
                // Reset all state
                resetGameState();
                setPartyId(null);
                setShowWinnerModal(false);
                setWinnerPlayer(null);
                if (winnerTimeout) {
                    clearTimeout(winnerTimeout);
                    setWinnerTimeout(null);
                }
                // Navigate to results
                navigate("/results");
            }
            catch (error) {
                console.error("Error:", error);
                toast.error("Failed to end the game properly. Please try again.");
                // Reset gameEnded flag on error to allow retry
                setGameEnded(false);
                setGameStarted(true);
            }
        }
        else {
            toast.error("The game cannot be ended yet as more than one player is still playing.");
        }
        setIsEnding(false);
    };
    const handleUpdateGameState = async (updatedGames) => {
        try {
            const currentTotalRebuys = games.reduce((sum, game) => sum + (game.rebuys || 0), 0);
            const nextTotalRebuys = updatedGames.reduce((sum, game) => sum + (game.rebuys || 0), 0);
            const returningPlayers = updatedGames.filter(updatedGame => {
                const originalGame = games.find(g => g.playerId === updatedGame.playerId);
                return originalGame?.outAt && !updatedGame.outAt;
            });
            setGames(updatedGames);
            const updatedSelectedPlayers = [...selectedPlayers];
            returningPlayers.forEach(game => {
                const player = players.find(p => p.id === game.playerId);
                if (player && !selectedPlayers.find(p => p.id === player.id)) {
                    updatedSelectedPlayers.push(player);
                }
            });
            setSelectedPLayers(updatedSelectedPlayers);
            setOutPlayers(prevOutPlayers => prevOutPlayers.filter(player => !returningPlayers.find(game => game.playerId === player.id)));
            const totalRebuys = updatedGames.reduce((sum, game) => sum + (game.rebuys || 0), 0);
            const newTotalStack = initialPlayerCount * 5350 + (totalRebuys * 5350);
            const newPot = initialPlayerCount * 5 + (totalRebuys * 4);
            setTotalStack(newTotalStack);
            setPot(newPot);
            await saveGameState(timeLeft);
            const remainingOutPlayers = updatedGames.filter(game => game.outAt);
            remainingOutPlayers.sort((a, b) => {
                const dateA = new Date(a.outAt);
                const dateB = new Date(b.outAt);
                return dateB.getTime() - dateA.getTime();
            });
            remainingOutPlayers.forEach((game, index) => {
                const position = initialPlayerCount - remainingOutPlayers.length + index + 1;
                game.position = position;
                game.points = remainingOutPlayers.length - index;
            });
            await saveGameState(timeLeft);
            toast.success("Game state updated successfully!");
            if (nextTotalRebuys > currentTotalRebuys) {
                queueRebuySound();
            }
        }
        catch (error) {
            console.error("Error updating game state:", error);
            toast.error("Failed to update game state");
        }
    };
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
    return (_jsxs("div", { style: {
            height: '100vh',
            maxWidth: '100%',
            margin: 'auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }, children: [_jsx(WinnerModal, { isOpen: showWinnerModal, onClose: () => setShowWinnerModal(false), winner: winnerPlayer, games: games, pot: pot, initialPlayerCount: initialPlayerCount, selectedPlayers: selectedPlayers }), _jsx(EditGameStateModal, { isOpen: showEditModal, onClose: () => setShowEditModal(false), games: games, selectedPlayers: selectedPlayers, players: players, onUpdateStats: handleUpdateGameState, blindIndex: blindIndex, setBlindIndex: setBlindIndex, timeLeft: timeLeft, setTimeLeft: setTimeLeft, currentBlindDuration: currentBlindDuration, setCurrentBlindDuration: setCurrentBlindDuration, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, setSmallBlind: setSmallBlind, setBigBlind: setBigBlind, setAnte: setAnte, isPaused: isPaused, setIsPaused: setIsPaused }), _jsx(KillerSelectionModal, { killer: killer, games: games, currentlyPlayingPlayers: selectedPlayers.filter((p) => !games.find((g) => g.playerId === p.id && g.outAt)), rebuyPlayerId: rebuyPlayerId, playerOutGame: playerOutGame, handlePlayerKillSelection: handlePlayerKillSelection }), _jsx(ConfirmDialog, { isOpen: showRebuyConfirm, onClose: () => setShowRebuyConfirm(false), onConfirm: confirmRebuy, title: "Confirm Rebuy", description: "Has this player paid for the rebuy?", confirmText: "Yes, Paid", cancelText: "Cancel", variant: "warning" }), _jsx(ConfirmDialog, { isOpen: showResetConfirm, onClose: () => setShowResetConfirm(false), onConfirm: async () => {
                    try {
                        // First delete the game state to prevent race conditions
                        try {
                            await api.delete(API_ENDPOINTS.GAME_STATE);
                        }
                        catch (error) {
                            console.error('Error deleting game state:', error);
                            toast.error('Failed to delete game state');
                            return;
                        }
                        // Then delete the party if we have a partyId
                        if (partyId) {
                            try {
                                await api.delete(`/parties/${partyId}`);
                            }
                            catch (error) {
                                console.error('Error deleting party:', error);
                                // Continue even if party deletion fails, as game state is already deleted
                                toast.error('Warning: Failed to delete party, but game state was reset');
                            }
                        }
                        // Reset all local state
                        resetGameState();
                        setGameStarted(false);
                        setShowConfig(true);
                        setPartyId(null);
                        // Verify game state is deleted
                        try {
                            const stateCheck = await api.get(API_ENDPOINTS.GAME_STATE);
                            if (stateCheck.data?.state) {
                                console.error('Game state still exists after deletion');
                                // Force delete again
                                await api.delete(API_ENDPOINTS.GAME_STATE);
                            }
                        }
                        catch (error) {
                            // 404 is expected here, as the state should be deleted
                            if (error.response?.status !== 404) {
                                console.error('Error verifying game state deletion:', error);
                            }
                        }
                        toast.success('Game state reset successfully!');
                    }
                    catch (error) {
                        console.error('Error resetting game:', error);
                        toast.error('Failed to reset game state completely');
                    }
                }, title: "Reset Game", description: "All game data will be lost. Are you sure?", confirmText: "Yes, Reset", cancelText: "Cancel", variant: "destructive" }), _jsx(ConfirmDialog, { isOpen: showEndGameConfirm, onClose: () => setShowEndGameConfirm(false), onConfirm: handleGameEnd, title: "End Game", description: "Are you sure you want to end the game?", confirmText: "Yes, End Game", cancelText: "Cancel", variant: "destructive" }), _jsx(ConfirmDialog, { isOpen: showEliminateConfirm, onClose: () => {
                    setShowEliminateConfirm(false);
                    setPendingEliminateData(null);
                }, onConfirm: confirmElimination, title: "Confirm Elimination", description: `Are you sure ${selectedPlayers.find(p => p.id === pendingEliminateData?.playerId)?.name} is out of the game?`, confirmText: "Yes, Eliminate", cancelText: "Cancel", variant: "destructive" }), _jsx(ConfirmDialog, { isOpen: showKillerConfirm, onClose: () => {
                    setShowKillerConfirm(false);
                    setPendingKillerId(null);
                }, onConfirm: confirmKillerSelection, title: "Confirm Killer Selection", description: `Are you sure you want to select ${selectedPlayers.find(p => p.id === pendingKillerId)?.name} as the killer?`, confirmText: `Yes, Select ${selectedPlayers.find(p => p.id === pendingKillerId)?.name}`, cancelText: "Cancel", variant: "warning" }), showConfig && (_jsx(GameConfiguration, { championnat: championnat, players: players, onStartGameConfiguration: handleStartGameConfiguration })), showReview && !partyId && (_jsx(ReviewSelectedPlayers, { selectedPlayers: selectedPlayers, selectedTournament: selectedTournament, onConfirm: confirmAndStartGame })), gameStarted && (_jsxs("div", { style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#ffffff',
                    zIndex: 40,
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
                            gap: '16px',
                            padding: '10px'
                        }, children: [_jsxs("div", { style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }, children: [_jsx("h1", { style: {
                                            fontSize: '1.5em',
                                            fontFamily: 'DS-DIGI',
                                            color: isPaused ? "red" : "green",
                                            textShadow: "2px 2px 10px 2px rgba(0, 0, 0, 0.3)",
                                            margin: 0
                                        }, children: isPaused ? "Game Paused" : "Game in Progress" }), _jsxs("div", { style: {
                                            display: 'flex',
                                            gap: '8px'
                                        }, children: [_jsx(Button, { onClick: () => {
                                                    setShowEditModal(true);
                                                }, className: "bg-blue-600 hover:bg-blue-700 text-white font-['DS-DIGI'] text-lg text-shadow-sm shadow-md border border-slate-500/70 hover:border-slate-900 ", children: "Edit Game" }), _jsx(Button, { onClick: updateBlinds, className: "bg-green-500  hover:bg-amber-600 text-white font-['DS-DIGI'] text-lg shadow-md border border-1 border-green-500/30 hover:border-amber-600", disabled: !gameStarted || blindIndex >= blinds.length - 1, children: `>> Next Blind` })] })] }), _jsxs("div", { style: {
                                    display: 'flex',
                                    gap: '8px'
                                }, children: [_jsx(Button, { onClick: toggleFullscreen, className: "bg-purple-500 hover:bg-purple-600 text-white font-['DS-DIGI'] text-lg shadow-md border border-purple-200/80 hover:border-purple-600", children: isFullscreen ? 'Fullscreen OFF' : 'Fullscreen ON' }), _jsx(Button, { style: {
                                            textShadow: "4px 2px 10px 2px rgba(0, 0, 0, 0.3)",
                                        }, onClick: () => setShowResetConfirm(true), className: "bg-amber-500 hover:bg-amber-600 text-white font-['DS-DIGI'] text-lg shadow-md border borderslate-200/80 hover:border-amber-600", children: "Reset Game" }), _jsx(Button, { onClick: () => {
                                            if (games.filter((game) => !game.outAt).length === 1) {
                                                setShowEndGameConfirm(true);
                                            }
                                            else {
                                                toast.error("The game cannot be ended yet as more than one player is still playing.");
                                            }
                                        }, className: "bg-red-500 hover:bg-red-600 text-white font-['DS-DIGI'] text-lg mr-32 border border-red-200/80 hover:border-red-600 shadow-sm", children: "End Game" })] })] }), _jsxs("div", { style: {
                            flexGrow: 1,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            // gap: '16px',
                            backgroundColor: '#ffffff'
                        }, children: [_jsx(GameControls, { gameStarted: gameStarted, isPaused: isPaused, timeLeft: timeLeft, smallBlind: smallBlind, bigBlind: bigBlind, ante: ante, handleGameEnd: handleGameEnd, setIsPaused: setIsPaused, pot: pot, middleStack: middleStack, totalRebuys: totalRebuys, outPlayers: outPlayers, setSmallBlind: setSmallBlind, setBigBlind: setBigBlind, setAnte: setAnte, setTimeLeft: setTimeLeft, blindIndex: blindIndex, setBlindIndex: setBlindIndex, initialTimeLeft: timeLeft || currentBlindDuration * 60, style: {
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
