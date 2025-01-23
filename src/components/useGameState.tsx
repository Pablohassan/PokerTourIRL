import { useState, useEffect } from "react";
import { Player, PlayerStats } from "./interfaces";
import api from "../api";

const useGameState = (
  gameStarted: boolean,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPlayers: Player[],
  setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  blindIndex: number,
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>,
  configBlindDuration: number,
) => {
  const [timeLeft, setTimeLeft] = useState<number>(configBlindDuration * 60);
  const [smallBlind, setSmallBlind] = useState(10);
  const [currentBlindDuration, setCurrentBlindDuration] = useState<number>(configBlindDuration);
  const [bigBlind, setBigBlind] = useState(20);
  const [ante, setAnte] = useState(0);
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

  const resetGameState = () => {
    setTimeLeft(configBlindDuration * 60);
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
    setCurrentBlindDuration(configBlindDuration);
    setLastSaveTime(0);
  };

  const saveGameState = async (currentTimeLeft: number = timeLeft) => {
    if (!initialGameStatePosted) {

      return;
    }

    const now = Date.now();
    if (now - lastSaveTime < 5000) {
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
      lastSavedTime: now,
      initialPlayerCount,
      currentBlindDuration,
    };

    try {
      const response = await api.post("/gameState", { state: gameState });
      if (response.status === 404) {
        console.log('No game state found (404)');
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error saving game state:', error,);
      setError('Failed to save game state');
    }
  };

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

      const response = await api.get("/gameState");


      if (!response.data?.state) {
        console.log('No saved game state found');
        setLoading(false);
        return;
      }

      const { state } = response.data;


      const elapsedTime = (Date.now() - state.lastSavedTime) / 1000;
      const adjustedTimeLeft = Math.max(0, state.timeLeft - elapsedTime);

      // First, process the games to ensure eliminated players are handled correctly
      const restoredGames = state.games.map((game: PlayerStats) => ({
        ...game,
        outAt: game.outAt ? new Date(game.outAt) : null
      }));

      // Filter out eliminated players from selectedPlayers
      const activePlayerIds = new Set(
        restoredGames
          .filter((game: PlayerStats) => !game.outAt)
          .map((game: PlayerStats) => game.playerId)
      );

      const activeSelectedPlayers = state.selectedPlayers.filter((player: Player) =>
        activePlayerIds.has(player.id)
      );

      // Process out players
      const eliminatedGames = restoredGames
        .filter((game: PlayerStats) => game.outAt)
        .sort((a: PlayerStats, b: PlayerStats) =>
          new Date(a.outAt!).getTime() - new Date(b.outAt!).getTime()
        );

      const restoredOutPlayers = eliminatedGames.map((game: PlayerStats) => {
        const player = state.selectedPlayers.find((p: Player) => p.id === game.playerId);
        if (!player) return null;
        return {
          ...player,
          position: game.position,
          points: game.points
        };
      }).filter(Boolean);

      // Restore all state values
      setTimeLeft(Math.floor(adjustedTimeLeft));
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
      setPositions(state.positions);
      setOutPlayers(restoredOutPlayers);
      setLastUsedPosition(Math.max(...Object.values(state.positions) as number[], 0));
      setGameStarted(true);
      setInitialGameStatePosted(true);
      setInitialPlayerCount(state.initialPlayerCount);
      setCurrentBlindDuration(state.currentBlindDuration || configBlindDuration);
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

  // Save game state periodically
  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        saveGameState(timeLeft);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, timeLeft]);

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
  };
};

export default useGameState;
