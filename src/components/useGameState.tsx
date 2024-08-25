import { useState, useEffect } from "react";
import { Player, PlayerStats } from "./interfaces";

const useGameState = (
  gameStarted: boolean,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPlayers: Player[],
  setSelectedPlayers: React.Dispatch<React.SetStateAction<Player[]>>,
  blindIndex: number,
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>,
  initialTimeLeft: number,
  onStateNotFound: () => void 

) => {
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
  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement
  const [error, setError] = useState<string | null>(null); 
  const [positions, setPositions] = useState<{ [key: number]: number }>({}); 
  const [outPlayers, setOutPlayers] = useState<Player[]>([]); // Ajoutez cette ligne
  const [lastUsedPosition, setLastUsedPosition] = useState<number>(0);
  const [initialPlayerCount, setInitialPlayerCount] = useState(selectedPlayers.length);

  

  const resetGameState = () => {
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
    setOutPlayers([]);  // Réinitialiser les joueurs éliminés
    setLastUsedPosition(0);// Réinitialiser la dernière position 
    setInitialPlayerCount(0);
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
  
    const gameStateString = JSON.stringify({ state: gameState });
 
  
    
      try {
        const response = await fetch('https://api.bourlypokertour.fr/gameState', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: gameStateString,
        });
    
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

       
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    } 
  

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
        initialPlayerCount
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
  


        setInitialGameStatePosted(true); // Mark the initial POST as done
      } catch (error) {
        console.error('Error posting initial game state:', error);
        setError('Error posting initial game state');
      }
    };

    const restoreState = async () => {
      try {
        const response = await fetch(`https://api.bourlypokertour.fr/gameState`);
    
        if (!response.ok) {
          if (response.status === 404) {
            console.log('No game state found (404).');
          setGameStarted(false);
          onStateNotFound();
        setLoading(false);
        return;
     
          }
          throw new Error('Failed to fetch game state');
        }
    
        const gameState = await response.json();
       
    
        if (!gameState.state) {
          console.error('No state found in the game state response');
          throw new Error('No state found in the game state response');
        }
    
        const { state } = gameState;
    
       
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
        setStateRestored(true);
        setInitialGameStatePosted(true);
        setInitialPlayerCount(state.initialPlayerCount);
    
      } catch (error) {
        console.error('Error restoring game state', error);
        setError('Error restoring game state');
        setGameStarted(false);
        onStateNotFound();
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    restoreState();
  }, []); // Run once on mount and when partyId changes


  useEffect(() => {
    if (!stateRestored && selectedPlayers.length > 0 && !totalStack) {
      setTotalStack(selectedPlayers.length * 5350);
    }
  }, [selectedPlayers.length, stateRestored]);

  useEffect(() => {
    if (gameStarted && pot === 0 && selectedPlayers.length > 0) {
      setPot(selectedPlayers.length * 5);
    }
  }, [gameStarted, selectedPlayers.length, pot]);

  useEffect(() => {
    const remainingPlayers = selectedPlayers.length;
    if (remainingPlayers > 0) {
      const newMiddleStack = totalStack / remainingPlayers;
      const roundedMiddleStack = Math.round(newMiddleStack);
      setMiddleStack(roundedMiddleStack);
      setSavedTotalStack(totalStack);
      saveGameState(timeLeft);
    }
  }, [totalStack, selectedPlayers.length, timeLeft]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStarted) {
        saveGameState(timeLeft);
        
      }
    }, 1000); // Save state every second
    return () => clearInterval(interval);
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
    loading,
    error,
    positions,
    setPositions,
    outPlayers,
    setOutPlayers,
    lastUsedPosition,  // Retourner lastUsedPosition
    setLastUsedPosition,  // 
    initialPlayerCount,  // Ajoutez cette ligne
    setInitialPlayerCount,  // Ajoutez cette ligne
  };
};

export default useGameState;