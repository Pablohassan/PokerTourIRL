import { useState, useEffect } from "react";
import { Player, PlayerStats } from "./interfaces";

const useGameState = (
  gameStarted: boolean,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPlayers: Player[],
  setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  blindIndex: number,
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>,
  initialTimeLeft: number
) => {
  console.log("useGameState hook initialized");

  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
  const [smallBlind, setSmallBlind] = useState(10);
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

  console.log("Initial state set up:", {
    timeLeft,
    smallBlind,
    bigBlind,
    ante,
    games,
    pot,
    middleStack,
    totalStack,
    rebuyPlayerId,
    killer,
    stateRestored,
    initialGameStatePosted,
    loading,
    error,
    positions,
    outPlayers,
    lastUsedPosition,
    initialPlayerCount,
  });

  const resetGameState = () => {
    console.log("Resetting game state");
    setTimeLeft(initialTimeLeft);
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
    console.log("Game state reset");
  };

  const saveGameState = async (currentTimeLeft: number = timeLeft) => {
    if (!initialGameStatePosted) return;

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
      lastSavedTime: Date.now(),
      initialPlayerCount,
    };

    console.log("Saving game state:", gameState);

    try {
      const response = await fetch('https://api.bourlypokertour.fr/gameState', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: gameState }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log("Game state saved successfully");

    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const postInitialGameState = async () => {
    const gameState = {
      timeLeft,
      smallBlind,
      bigBlind,
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
      lastSavedTime: Date.now(),
      initialPlayerCount,
    };
  
    console.log("Posting initial game state:", gameState);
  
    try {
      const response = await fetch('https://api.bourlypokertour.fr/gameState', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: gameState }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      console.log("Initial game state posted successfully");
  
      setInitialGameStatePosted(true); // Mark the initial POST as done
      console.log("initialGameStatePosted set to true");  // Add this line to verify
    } catch (error) {
      console.error('Error posting initial game state:', error);
      setError('Error posting initial game state');
    }
  };
  

  const restoreState = async () => {
    console.log("Restoring game state");

    try {
        const response = await fetch(`https://api.bourlypokertour.fr/gameState`);
        console.log("API Response:", response);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('No game state found (404).');
                setGameStarted(false);
                setStateRestored(false);
                setLoading(false);
                return;
            }
            throw new Error('Failed to fetch game state');
        }

        const gameState = await response.json();
        console.log("Game state data received:", gameState);

        if (!gameState.state) {
            console.error('No state found in the game state response');
            throw new Error('No state found in the game state response');
        }

        const { state } = gameState;
        console.log("Restored state:", state);

        const elapsedTime = (Date.now() - state.lastSavedTime) / 1000;
        const adjustedTimeLeft = Math.max(0, state.timeLeft - elapsedTime);

        setTimeLeft(Math.floor(adjustedTimeLeft));
        setSmallBlind(state.smallBlind);
        setBigBlind(state.bigBlind);
        setAnte(state.ante);
        setGames(state.games);
        setSelectedPlayers(state.selectedPlayers);
        setTotalStack(state.totalStack);
        setPot(state.pot);
        setRebuyPlayerId(state.rebuyPlayerId);
        setMiddleStack(state.middleStack);
        setBlindIndex(state.blindIndex);
        setPositions(state.positions);
        setOutPlayers(state.outPlayers);
        setLastUsedPosition(Math.max(...Object.values(state.positions) as number[], 0));
        setGameStarted(true);
        setInitialGameStatePosted(true);
        setInitialPlayerCount(state.initialPlayerCount);

        console.log("Game state restored successfully");

        setStateRestored(true);  // This should be set here, after successful restoration
    } catch (error) {
        console.error('Error restoring game state', error);
        setError('Error restoring game state');
        setGameStarted(false);
        setStateRestored(false);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    console.log("useEffect triggered for restoring state");
    restoreState();
}, []);

  useEffect(() => {
    if (!stateRestored && selectedPlayers.length > 0 && !totalStack) {
      const calculatedTotalStack = selectedPlayers.length * 5350;
      console.log("Setting totalStack:", calculatedTotalStack);
      setTotalStack(calculatedTotalStack);
    }
  }, [selectedPlayers.length, stateRestored]);

  useEffect(() => {
    if (gameStarted && pot === 0 && selectedPlayers.length > 0) {
      const calculatedPot = selectedPlayers.length * 5;
      console.log("Setting pot:", calculatedPot);
      setPot(calculatedPot);
    }
  }, [gameStarted, selectedPlayers.length, pot]);

  useEffect(() => {
    const remainingPlayers = selectedPlayers.length;
    if (remainingPlayers > 0) {
      const newMiddleStack = totalStack / remainingPlayers;
      const roundedMiddleStack = Math.round(newMiddleStack);
      console.log("Setting middleStack:", roundedMiddleStack);
      setMiddleStack(roundedMiddleStack);
      setSavedTotalStack(totalStack);
      saveGameState(timeLeft);
    }
  }, [totalStack, selectedPlayers.length, timeLeft]);

  useEffect(() => {
    console.log("Starting interval to save game state every second");
    const interval = setInterval(() => {
      if (gameStarted) {
        console.log("Interval saving game state");
        saveGameState(timeLeft);
      }
    }, 1000); // Save state every second
    return () => {
      console.log("Clearing interval");
      clearInterval(interval);
    };
  }, [gameStarted, timeLeft]);

  console.log("Returning values from useGameState");

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
    restoreState,
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
  };
};

export default useGameState;
