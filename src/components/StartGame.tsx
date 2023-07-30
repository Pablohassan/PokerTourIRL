import React, { useState, useEffect, ChangeEvent } from "react";
import api from "../api";
import { NewGameForm } from "./NewGameForm";

interface Player {
  id: number;
  name: string;
}

interface Game {
  id?: number;
  date: string;
  points: number;
  rebuys: number;
  playerId: number;
  partyId?: number;
  totalCost?: number;
  outAt?: Date | null;
}

interface StartGameProps {
  players: Player[];
  handlePlayerSelect: (playerId: number) => void;
  selectedPlayers: Player[];
  updateAfterGameEnd: (results: any) => void; // Changed the prop function name to 'updateAfterGameEnd'
  setParties: (parties: any) => void;
}

const StartGame: React.FC<StartGameProps> = ({
  selectedPlayers,
  handlePlayerSelect,
  players,
  setParties,
  updateAfterGameEnd,
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [blind, setBlind] = useState(1); // Replace with your initial blind value
  const [outPlayers, setOutPlayers] = useState<Player[]>([]);
  const [newGame, setNewGame] = useState({
    date: new Date(),
    points: 0,
    rebuys: 0,
  });

  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time === 0) {
          setBlind((blind) => blind * 2);
          return 20 * 60; // reset time
        } else {
          return time - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewGameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGame({ ...newGame, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date: Date) => {
    setNewGame({ ...newGame, date: date });
  };

  const handleAddNewGame = () => {
    if (selectedPlayers.length < 4) {
      alert("Please select at least 4 players before starting a new game");
    } else {
      handleGameStart(); // Assuming the game should start when new game data is submitted
    }
  };

  const handleGameStart = async () => {
    if (selectedPlayers.length < 4) {
      alert("Please select at least 4 players before starting a new game");
      return;
    }

    try {
      const response = await api.post("/game/start", {
        date: new Date(),
        players: selectedPlayers,
      });

      if (response.data && Array.isArray(response.data.games)) {
        setGames(response.data.games);
      }

      alert("New game started successfully");
      setGameStarted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to start new game");
    }
  };

  const handleRebuy = (playerId: number) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.playerId === playerId
          ? {
              ...game,
              rebuys: game.rebuys + 1,
              totalCost: (game.totalCost ?? 0) + 5,
            }
          : game
      )
    );
  };
  const calculatePoints = (totalPlayers: number, position: number) => {
    return position;
  };

  const handleOutOfGame = async (playerId: number) => {
    if (window.confirm("Is this player out of the game?")) {
      const gameIndex = games.findIndex((game) => game.playerId === playerId);
      if (gameIndex !== -1) {
        const game = games[gameIndex];
        const outAt = new Date();
        const updatedGameForApi = {
          ...game,
          points: calculatePoints(
            selectedPlayers.length,
            outPlayers.length + 1
          ),
          outAt: outAt.toISOString(),
        };
        const updatedGameForState = {
          ...game,
          points: calculatePoints(
            selectedPlayers.length,
            outPlayers.length + 1
          ),
          outAt: outAt,
        };

        try {
          await api.put(`/games/${game.id}`, updatedGameForApi);

          setGames((prevGames) => {
            const newGames = [...prevGames];
            newGames[gameIndex] = updatedGameForState;
            return newGames;
          });

          setOutPlayers((prevOutPlayers) => {
            const player = selectedPlayers.find(
              (player) => player.id === playerId
            );
            if (player) {
              return [...prevOutPlayers, player];
            } else {
              return prevOutPlayers;
            }
          });
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }
  };

  const handleGameEnd = async () => {
    if (window.confirm("Are you sure you want to stop the game?")) {
      // Here, no need to map over selectedPlayers, just use the games state
      try {
        // Make API call to save results to the database
        const res = await api.post("/gameResults", games);
        // After the results are saved successfully, update the parent component
        updateAfterGameEnd(games);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <div>
        <h3>Select Players:</h3>
        {players.map((player) => (
          <div key={player.id}>
            <input
              type="checkbox"
              id={`player-${player.id}`}
              name={player.name}
              value={player.id}
              onChange={() => handlePlayerSelect(player.id)}
              checked={selectedPlayers.some(
                (selectedPlayer) => selectedPlayer.id === player.id
              )}
            />
            <label htmlFor={`player-${player.id}`}>{player.name}</label>
          </div>
        ))}
      </div>
      <h2>Game in Progress</h2>
      {!gameStarted ? (
        <NewGameForm
          newGame={newGame}
          handleNewGameChange={handleNewGameChange}
          handleDateChange={handleDateChange}
          handleAddNewGame={handleAddNewGame}
        />
      ) : (
        <>
          {gameStarted && (
            <div>
              Time left: {timeLeft} seconds. Small/Big blind: {blind}/
              {blind * 2}
            </div>
          )}
          <div>
            {selectedPlayers.map((player) => (
              <div key={player.id}>
                <span>{player.name}</span>
                <button onClick={() => handleRebuy(player.id)}>Rebuy</button>
                <button onClick={() => handleOutOfGame(player.id)}>
                  Out of Game
                </button>
              </div>
            ))}
          </div>
          {!gameStarted && (
            <button onClick={handleGameStart}>Start Game</button>
          )}
          {gameStarted && <button onClick={handleGameEnd}>Stop Partie</button>}
        </>
      )}
      ;
    </div>
  );
};

export default StartGame;
