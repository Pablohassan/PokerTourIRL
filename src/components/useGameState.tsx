import { useState, useEffect, useRef } from "react";
import { Player, PlayerStats } from "./interfaces";
import api from "../api";
import { API_ENDPOINTS, API_BASE_URL } from '../config';
import { io, Socket } from "socket.io-client";

const useGameState = (
  gameStarted: boolean,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPlayers: Player[],
  setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  blindIndex: number,
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>,
  configBlindDuration: number,
) => {
  const socketRef = useRef<Socket | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(configBlindDuration * 60);
  const [smallBlind, setSmallBlind] = useState(10);
  const [currentBlindDuration, setCurrentBlindDuration] = useState<number>(configBlindDuration);
  const [bigBlind, setBigBlind] = useState(20);
  const [ante, setAnte] = useState(0);
  const [nextBlind, setNextBlind] = useState<{ small: number; big: number; ante: number } | null>(null);
  const [games, setGames] = useState<PlayerStats[]>([]);
  const [pot, setPot] = useState(0);
  const [middleStack, setMiddleStack] = useState(5350);
  const [savedTotalStack, setSavedTotalStack] = useState(0);
  const [totalStack, setTotalStack] = useState(savedTotalStack || 0);
  const [rebuyPlayerId, setRebuyPlayerId] = useState<number | null>(null);
  const [killer, setKiller] = useState(false);
  const [stateRestored, setStateRestored] = useState(false);
  const [initialGameStatePosted, setInitialGameStatePosted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<{ [key: number]: number }>({});
  const [outPlayers, setOutPlayers] = useState<Player[]>([]);
  const [lastUsedPosition, setLastUsedPosition] = useState<number>(0);
  const [initialPlayerCount, setInitialPlayerCount] = useState(selectedPlayers.length);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [blindLevelStartedAt, setBlindLevelStartedAt] = useState<number | null>(null);
  const [pausedTimeRemaining, setPausedTimeRemaining] = useState<number | null>(null);


  // WebSocket connection and event listeners
  useEffect(() => {
    if (!gameStarted || gameEnded) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketConnected(false);
      }
      return;
    }

    if (!socketRef.current) {
      const socket = io(API_BASE_URL.replace('/api', ''), {
        withCredentials: true,
        transports: ['websocket', 'polling'], // Try websocket first
      });

      socket.on('connect', () => {
        console.log('WebSocket connected');
        setSocketConnected(true);
        // Request initial state
        socket.emit('timer:get');
      });

      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setSocketConnected(false);
      });

      socket.on('timer:update', (data) => {
        // Sync everything from server
        // Using batching by setting states together if possible, though React handles this
        setTimeLeft(data.timeLeft);
        setBlindIndex(data.blindIndex);
        setSmallBlind(data.small);
        setBigBlind(data.big);
        setAnte(data.ante);
        setNextBlind(data.nextBlind);
        setIsPaused(data.isPaused);
        setBlindLevelStartedAt(data.blindLevelStartedAt);
        setPausedTimeRemaining(data.pausedTimeRemaining);
        console.log('[FrontendDebug] WebSocket Update:', { timeLeft: data.timeLeft, isPaused: data.isPaused, startedAt: data.blindLevelStartedAt });
      });

      socket.on('timer:blindAdvance', (data) => {
        console.log('Blind level advanced:', data.message);
        // We could trigger a toast or sound here if not already handled by BlindTimer
      });

      socketRef.current = socket;
    }

    return () => {
      // Don't disconnect here on every re-render, only when dependencies change or unmount
    };
  }, [gameStarted, gameEnded]);

  // Separate effect for cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const resetGameState = (newBlindDuration?: number) => {
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

  // Retry configuration
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff in ms

  // Sync status for UI feedback
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [pendingSave, setPendingSave] = useState(false);

  // WebSocket control functions
  const socketPauseTimer = () => {
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('timer:pause');
    }
  };

  const socketResumeTimer = () => {
    if (socketRef.current && socketConnected) {
      socketRef.current.emit('timer:resume');
    }
  };

  const saveGameState = async (currentTimeLeft: number = timeLeft, forceSave: boolean = false) => {
    if (!initialGameStatePosted || gameEnded) {
      // Don't save if game has ended
      return;
    }

    const now = Date.now();
    // Allow forceSave to bypass throttle (for critical actions like eliminations)
    if (!forceSave && now - lastSaveTime < 2000) {
      // Queue a pending save if we're skipping due to throttle
      setPendingSave(true);
      return;
    }
    setLastSaveTime(now);
    setPendingSave(false);
    setSyncStatus('syncing');

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
      initialPlayerCount,
      currentBlindDuration,
      gameEnded,
      blindLevelStartedAt,
      pausedTimeRemaining,
      // lastSavedTime is purely for legacy fallback now, we use explicitly set timestamps
      lastSavedTime: now,
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await api.post(API_ENDPOINTS.GAME_STATE, { state: gameState });
        setSyncStatus('synced');
        setError(null); // Clear previous errors on success
        return; // Success, exit
      } catch (err) {
        lastError = err as Error;
        console.warn(`Save attempt ${attempt + 1}/${MAX_RETRIES} failed:`, err);

        // Check if it's an auth error - don't retry those
        if ((err as any)?.response?.status === 401) {
          console.error('Auth error - not retrying');
          break;
        }

        if (attempt < MAX_RETRIES - 1) {
          await new Promise(r => setTimeout(r, RETRY_DELAYS[attempt]));
        }
      }
    }

    // All retries failed
    console.error('All save attempts failed:', lastError);
    setSyncStatus('error');
    setError('Échec de synchronisation - vérifiez votre connexion');
  };

  // Process pending saves after throttle window
  useEffect(() => {
    if (pendingSave && gameStarted && !gameEnded) {
      const timer = setTimeout(() => {
        saveGameState(timeLeft);
      }, 2100); // Just after throttle window
      return () => clearTimeout(timer);
    }
  }, [pendingSave, gameStarted, gameEnded]);


  const postInitialGameState = async () => {
    try {
      setLoading(true);
      setInitialGameStatePosted(true);

      setLoading(false);
    } catch (error) {
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

      const savedSelectedPlayers = Array.isArray(state.selectedPlayers) ? state.selectedPlayers as Player[] : [];
      const savedGames = Array.isArray(state.games) ? state.games as PlayerStats[] : [];


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
      const restoredGames = savedGames.map((game: PlayerStats) => ({
        ...game,
        outAt: game.outAt ? new Date(game.outAt) : null
      }));

      // Filter out eliminated players from selectedPlayers
      const activePlayerIds = new Set(
        restoredGames
          .filter((game: PlayerStats) => !game.outAt)
          .map((game: PlayerStats) => game.playerId)
      );

      const activeSelectedPlayers = savedSelectedPlayers.filter((player: Player) =>
        activePlayerIds.has(player.id)
      );

      // Process out players
      const eliminatedGames = restoredGames
        .filter((game: PlayerStats) => game.outAt)
        .sort((a: PlayerStats, b: PlayerStats) =>
          new Date(a.outAt!).getTime() - new Date(b.outAt!).getTime()
        );

      const restoredOutPlayers = eliminatedGames.map((game: PlayerStats) => {
        const player = savedSelectedPlayers.find((p: Player) => p.id === game.playerId);
        if (!player) return null;
        return {
          ...player,
          position: game.position,
          points: game.points
        } as Player;
      }).filter(Boolean) as Player[];

      const fallbackOutPlayers = (state.outPlayers ?? []) as Player[];
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
      setLastUsedPosition(Math.max(...Object.values(state.positions || {}) as number[], state.lastUsedPosition || 0));
      setGameStarted(true);
      setInitialGameStatePosted(true);
      setInitialPlayerCount(state.initialPlayerCount);
      setBlindLevelStartedAt(state.blindLevelStartedAt);
      setPausedTimeRemaining(state.pausedTimeRemaining);
      setStateRestored(true);

    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('No game state found (404)');
        setLoading(false);
        return;
      }
      console.error('Error restoring game state:', error);
      setError(error.message || 'Failed to restore game state');
      setGameStarted(false);
    } finally {
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

  // Local countdown for smooth UI (interpolating between WebSocket updates)
  useEffect(() => {
    if (gameStarted && !gameEnded && !isPaused && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          // console.log('[FrontendDebug] Local Tick:', { prev, next });
          return next < 0 ? 0 : next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameEnded, isPaused]); // Removed timeLeft dependency to avoid recreating interval every second

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
    syncStatus, // Sync status for UI feedback
    socketConnected,
    socketPauseTimer,
    socketResumeTimer,
    nextBlind,
    isPaused,
    setIsPaused,
    setBlindLevelStartedAt,
    setPausedTimeRemaining,
  };
};

export default useGameState;
