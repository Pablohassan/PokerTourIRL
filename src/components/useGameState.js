import { useState, useEffect } from "react";
import api from "../api";
import { API_ENDPOINTS } from '../config';
const useGameState = (gameStarted, setGameStarted, selectedPlayers, setSelectedPlayers, blindIndex, setBlindIndex, configBlindDuration) => {
    const [timeLeft, setTimeLeft] = useState(configBlindDuration * 60);
    const [smallBlind, setSmallBlind] = useState(10);
    const [currentBlindDuration, setCurrentBlindDuration] = useState(configBlindDuration);
    const [bigBlind, setBigBlind] = useState(20);
    const [ante, setAnte] = useState(0);
    const [games, setGames] = useState([]);
    const [pot, setPot] = useState(0);
    const [middleStack, setMiddleStack] = useState(5350);
    const [savedTotalStack, setSavedTotalStack] = useState(0);
    const [totalStack, setTotalStack] = useState(savedTotalStack || 0);
    const [rebuyPlayerId, setRebuyPlayerId] = useState(null);
    const [killer, setKiller] = useState(false);
    const [stateRestored, setStateRestored] = useState(false);
    const [initialGameStatePosted, setInitialGameStatePosted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [positions, setPositions] = useState({});
    const [outPlayers, setOutPlayers] = useState([]);
    const [lastUsedPosition, setLastUsedPosition] = useState(0);
    const [initialPlayerCount, setInitialPlayerCount] = useState(selectedPlayers.length);
    const [lastSaveTime, setLastSaveTime] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const resetGameState = (newBlindDuration) => {
        const finalDuration = typeof newBlindDuration === "number"
            ? newBlindDuration
            : configBlindDuration;
        setTimeLeft(finalDuration * 60);
        setCurrentBlindDuration(finalDuration);
        setSmallBlind(10);
        setBigBlind(20);
        setAnte(0);
        setGames([]);
        setPot(0);
        setMiddleStack(5350);
        setTotalStack(0);
        setSelectedPlayers([]);
        setRebuyPlayerId(null);
        setKiller(false);
        setBlindIndex(0);
        setInitialGameStatePosted(false);
        setPositions({});
        setOutPlayers([]);
        setLastUsedPosition(0);
        setInitialPlayerCount(0);
        setLastSaveTime(0);
        setGameEnded(false);
    };
    const saveGameState = async (currentTimeLeft = timeLeft) => {
        if (!initialGameStatePosted || gameEnded) {
            // Don't save if game has ended
            return;
        }
        const now = Date.now();
        if (now - lastSaveTime < 2000) {
            return;
        }
        setLastSaveTime(now);
        const gameState = {
            timeLeft: currentTimeLeft,
            smallBlind,
            bigBlind,
            ante,
            games,
            selectedPlayers,
            totalStack,
            pot,
            middleStack,
            rebuyPlayerId,
            killer,
            blindIndex,
            positions,
            outPlayers,
            lastUsedPosition,
            lastSavedTime: now,
            initialPlayerCount,
            currentBlindDuration,
            gameEnded,
        };
        try {
            const response = await api.post(API_ENDPOINTS.GAME_STATE, { state: gameState });
            if (response.status === 404) {
                setLoading(false);
                return;
            }
        }
        catch (error) {
            console.error('Error saving game state:', error);
            setError('Failed to save game state');
        }
    };
    const postInitialGameState = async () => {
        try {
            setLoading(true);
            setInitialGameStatePosted(true);
            setLoading(false);
        }
        catch (error) {
            console.error('Error marking initial game state as posted:', error);
            setError('Failed to mark initial game state as posted');
            setLoading(false);
            throw error;
        }
    };
    const restoreState = async () => {
        try {
            // Don't restore state if game has already ended
            if (gameEnded) {
                setLoading(false);
                return;
            }
            const response = await api.get(API_ENDPOINTS.GAME_STATE);
            if (!response.data?.state) {
                console.log('No saved game state found');
                setLoading(false);
                return;
            }
            const { state } = response.data;
            const savedSelectedPlayers = Array.isArray(state.selectedPlayers) ? state.selectedPlayers : [];
            const savedGames = Array.isArray(state.games) ? state.games : [];
            // Calculate elapsed time since last save
            const lastSaved = typeof state.lastSavedTime === 'number' ? state.lastSavedTime : Date.now();
            const elapsedTime = (Date.now() - lastSaved) / 1000;
            const restoredBlindDuration = state.currentBlindDuration || configBlindDuration;
            // Calculate remaining time for current blind level
            let adjustedTimeLeft = Math.max(0, state.timeLeft - elapsedTime);
            // If time has elapsed past the current blind level
            if (adjustedTimeLeft <= 0) {
                // Reset to the blind duration but account for overflow time
                const overflowTime = Math.abs(adjustedTimeLeft);
                adjustedTimeLeft = restoredBlindDuration * 60 - (overflowTime % (restoredBlindDuration * 60));
            }
            // First, process the games to ensure eliminated players are handled correctly
            const restoredGames = savedGames.map((game) => ({
                ...game,
                outAt: game.outAt ? new Date(game.outAt) : null
            }));
            // Filter out eliminated players from selectedPlayers
            const activePlayerIds = new Set(restoredGames
                .filter((game) => !game.outAt)
                .map((game) => game.playerId));
            const activeSelectedPlayers = savedSelectedPlayers.filter((player) => activePlayerIds.has(player.id));
            // Process out players
            const eliminatedGames = restoredGames
                .filter((game) => game.outAt)
                .sort((a, b) => new Date(a.outAt).getTime() - new Date(b.outAt).getTime());
            const restoredOutPlayers = eliminatedGames.map((game) => {
                const player = savedSelectedPlayers.find((p) => p.id === game.playerId);
                if (!player)
                    return null;
                return {
                    ...player,
                    position: game.position,
                    points: game.points
                };
            }).filter(Boolean);
            const fallbackOutPlayers = (state.outPlayers ?? []);
            const mergedOutPlayers = restoredOutPlayers.length > 0 ? restoredOutPlayers : fallbackOutPlayers;
            // Update state with adjusted time
            setTimeLeft(Math.floor(adjustedTimeLeft));
            setCurrentBlindDuration(restoredBlindDuration);
            setSmallBlind(state.smallBlind);
            setBigBlind(state.bigBlind);
            setAnte(state.ante);
            setGames(restoredGames);
            setSelectedPlayers(activeSelectedPlayers);
            setTotalStack(state.totalStack);
            setPot(state.pot);
            setRebuyPlayerId(state.rebuyPlayerId);
            setMiddleStack(state.middleStack);
            setBlindIndex(state.blindIndex);
            setPositions(state.positions || {});
            setOutPlayers(mergedOutPlayers);
            setLastUsedPosition(Math.max(...Object.values(state.positions || {}), state.lastUsedPosition || 0));
            setGameStarted(true);
            setInitialGameStatePosted(true);
            setInitialPlayerCount(state.initialPlayerCount);
            setStateRestored(true);
        }
        catch (error) {
            if (error.response?.status === 404) {
                console.log('No game state found (404)');
                setLoading(false);
                return;
            }
            console.error('Error restoring game state:', error);
            setError(error.message || 'Failed to restore game state');
            setGameStarted(false);
        }
        finally {
            setLoading(false);
        }
    };
    // Initial state restoration
    useEffect(() => {
        restoreState();
    }, []);
    // Calculate total stack when players change
    useEffect(() => {
        if (!stateRestored && selectedPlayers.length > 0 && !totalStack) {
            const calculatedTotalStack = selectedPlayers.length * 5350;
            setTotalStack(calculatedTotalStack);
        }
    }, [selectedPlayers.length, stateRestored, totalStack]);
    // Calculate initial pot
    useEffect(() => {
        if (gameStarted && pot === 0 && selectedPlayers.length > 0) {
            const calculatedPot = selectedPlayers.length * 5;
            setPot(calculatedPot);
        }
    }, [gameStarted, selectedPlayers.length, pot]);
    // Update middle stack when total stack changes
    useEffect(() => {
        const remainingPlayers = selectedPlayers.length;
        if (remainingPlayers > 0) {
            const newMiddleStack = totalStack / remainingPlayers;
            const roundedMiddleStack = Math.round(newMiddleStack);
            setMiddleStack(roundedMiddleStack);
            setSavedTotalStack(totalStack);
        }
    }, [totalStack, selectedPlayers.length]);
    // Save game state periodically (but not if game has ended)
    useEffect(() => {
        if (gameStarted && !gameEnded) {
            const interval = setInterval(() => {
                saveGameState(timeLeft);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameStarted, gameEnded, timeLeft]);
    return {
        timeLeft,
        setTimeLeft,
        smallBlind,
        setSmallBlind,
        bigBlind,
        setBigBlind,
        ante,
        setAnte,
        games,
        setGames,
        pot,
        postInitialGameState,
        setPot,
        middleStack,
        savedTotalStack,
        setSavedTotalStack,
        totalStack,
        setTotalStack,
        saveGameState,
        resetGameState,
        rebuyPlayerId,
        setRebuyPlayerId,
        killer,
        setKiller,
        stateRestored,
        currentBlindDuration,
        setCurrentBlindDuration,
        loading,
        error,
        positions,
        setPositions,
        outPlayers,
        setOutPlayers,
        lastUsedPosition,
        setLastUsedPosition,
        initialPlayerCount,
        setInitialPlayerCount,
        initialGameStatePosted,
        setInitialGameStatePosted,
        gameEnded,
        setGameEnded,
    };
};
export default useGameState;
