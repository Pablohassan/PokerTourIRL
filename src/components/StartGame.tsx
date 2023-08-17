import React, { useState, useEffect, ChangeEvent } from "react";
import api from "../api";
import { NewGameForm } from "./NewGameForm";
import SelectPlayersGame from "./SelectPlayersGame";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Player, PlayerStats } from "./interfaces";
import { CardPlayer } from "./CardPlayer";

import DSdigital from "../assets/fonts/DS-DIGI.ttf";

interface Tournaments {
  id: number;
  year: number;
  createdAt: Date;
}

interface StartGameProps {
  players: Player[];
  handlePlayerSelect: (playerId: number) => void;
  selectedPlayers: Player[];
  setSelectedPLayers: React.Dispatch<React.SetStateAction<Player[]>>;
  updateAfterGameEnd: (results: any) => void; // Changed the prop function name to 'updateAfterGameEnd'
  setParties: (parties: any) => void;
  championnat: Tournaments[];
}

const StartGame: React.FC<StartGameProps> = ({
  championnat,
  selectedPlayers,
  setSelectedPLayers,
  handlePlayerSelect,
  players,
  updateAfterGameEnd,
}) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [games, setGames] = useState<PlayerStats[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [blind, setBlind] = useState(1); // Replace with your initial blind value
  const [outPlayers, setOutPlayers] = useState<Player[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [selectedTournamentId, setSelectedTournamentId] = useState<
    number | null
  >(null);
  const [isSelectPlayersModalOpen, setSelectPlayersModalOpen] = useState(true);
  const [killer, setKiller] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
 
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
        if (isPaused) {
          return time; // If the game is paused, don't decrement timeLeft
        }
        if (time === 0) {
          setBlind((blind) => blind * 2);
          return 20 * 60; // reset time
        } else {
          return time - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isPaused]);

  const openPlayerModal = () => {
    setSelectPlayersModalOpen(true);
  };

  const closePlayerModal = () => {
    setSelectPlayersModalOpen(false);
  };

  const noTournaments = championnat.length === 0;

  const onStartGame = async () => {
    console.log("Attempting to start the game..."); // add this line
    if (selectedPlayers.length < 4) {
      alert("Please select at least 4 players before starting a new game");
    } else {
    
      setSelectPlayersModalOpen(true);  // Close the "Select Players" modal
    }

    // vérifiez si aucun tournoi n'existe

    const actualTournamentId = noTournaments ? null : selectedTournamentId;

    try {
      const response = await api.post("/playerStats/start", {
        date: new Date(),
        players: selectedPlayers.map((player) => player.id),
        tournamentId: actualTournamentId, // Utilisez cette variable ici
      });

      if (response.data && response.data.message) {
        alert(response.data.message);
        setGameStarted(true);
        if (
          response.data.playerStats &&
          Array.isArray(response.data.playerStats)
        ) {
          setGames(response.data.playerStats);
        }
      }
    } catch (err: any) {
      console.error("Server response:", err.response?.data);
      console.error(err);
      alert("Failed to start new game");
    }
    setSelectPlayersModalOpen(false)
    
  };





  const handleNewGameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGame({ ...newGame, [event.target.name]: event.target.value });
  };

  const handleDateChange = (date: Date) => {
    setNewGame({ ...newGame, date: date });
  };

  const handleRebuy = (playerId: number) => {
    if (window.confirm("Is this player payed the rebuy?")) {
      openPlayerModal();
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
    }
  };
  const calculatePoints = (position: number) => {
    return position;
};

const points = calculatePoints(outPlayers.length);
console.log("Calculated Points:", points);


  const handlePlayerKillSelection = (killerPlayerId: number) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.playerId === killerPlayerId
          ? { ...game, kills: game.kills + 1 }
          : game
      )
    );

    // Fermer la modale après la sélection
    closePlayerModal();
  };

  const handleOutOfGame = async (
    
    partyId: number,
    playerId: number,
    eliminatedById: number | null
  ) => {
    console.log("Player ID clicked for Out of Game:", playerId);

    if (window.confirm("Is this player out of the game?")) {
      setKiller(true)
      const gameIndex = games.findIndex((game) => game.playerId === playerId);
      if (gameIndex !== -1) {
        const game = games[gameIndex];
        const outAt = new Date();
        const updatedGameForApi = {
          ...game,
          points: calculatePoints(
            selectedPlayers.length,
           
           
          ),
          outAt: outAt.toISOString(),
        };
        const updatedGameForState = {
          ...game,
          points: calculatePoints(
            
            outPlayers.length + 1
          ),
          outAt: outAt,
        };

        try {
         await api.put(`/gamesResults/${game.id}`, updatedGameForApi);

          await api.put("/playerStats/eliminate", {
            partyId: partyId, // Remplacez par l'ID de la partie en cours
            playerId: playerId,
            eliminatedById: eliminatedById,
            points:points

          });
          

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

          setSelectedPLayers((prevSelectedPlayers) => {
            return prevSelectedPlayers.filter(
              (player) => player.id !== playerId
            );
          });
        } catch (error: any) {
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
      setIsOpen(false);
    }
  };
  console.log(games);
  console.log("si game started" ,gameStarted)

  const currentlyPlayingPlayers = games.filter(game => !game.outAt).map(game => {
    return players.find(player => player.id === game.playerId);
});
  return (
    <div className="">
       <Modal  isOpen={!gameStarted} onClose={closePlayerModal}>
  <ModalHeader>Select Players and Game Details</ModalHeader>
  <ModalBody>
       
          
          <div>
            <SelectPlayersGame
              players={players}
              selectedPlayers={selectedPlayers}
              handlePlayerSelect={handlePlayerSelect}
              onStartGame={onStartGame}
              championnat={championnat}
              selectedTournamentId={selectedTournamentId}
              setSelectedTournamentId={setSelectedTournamentId}
            />
            <h2>Game in Progress</h2>
            <NewGameForm
              newGame={newGame}
              handleNewGameChange={handleNewGameChange}
              handleDateChange={handleDateChange}
              handleAddNewGame={onStartGame} // use onStartGame here
            />
          </div>
          </ModalBody>
        </Modal>
         
        <Modal isOpen={gameStarted} onClose={handleGameEnd}>
         <ModalHeader>Game in Progress</ModalHeader>
          <ModalBody>
        <div style={{
      margin: "10 auto",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      
  
            }}>
              {gameStarted && (
                <>
                <div  className="p-5 flex flex-col items-center">
                  <div >
                   
                    <Button  color="warning" variant="bordered" style={{ padding: "20", fontFamily:"font-ds-digi" }}>
                      Time left: {timeLeft} seconds.
                    </Button>
                  </div>
                  <div >
                    Small blind: {blind} / Big Blind :{blind * 2}
                  </div>
                </div>
             
        
           
        <Button onClick={handleGameEnd}>
          Stop Partie
        </Button>
        <Button className="rounded-full"  onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Resume" : "Pause"}
        </Button>
        </>
    )}

              <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {currentlyPlayingPlayers.map((player) => {
                  // Trouver le jeu correspondant au joueur actuel
                  const gameForPlayer = games.find(
                    (game) => game.playerId === player?.id
                  );

                  // Si le jeu existe pour ce joueur, affichez les détails, sinon affichez une erreur
                  return (
                    <div
                      key={player?.id}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                     
                        {gameForPlayer ? (
                 <CardPlayer
                 playername={player?.name?? " none"}
                 recave={gameForPlayer.rebuys}
                 kill={gameForPlayer.kills}
                 rebuy={() => handleRebuy(gameForPlayer.playerId)}
                 outOfGame={() => 
                     handleOutOfGame(
                         gameForPlayer.partyId,
                         gameForPlayer.playerId,
                         gameForPlayer.eliminatedById
                     )
                 }
             />
                        ) : (
                          <div>Erreur: Pas de jeu pour {player?.name}</div>
                        )}
                  
                    </div>
                  );
                })}
              </div>
            </div>
            </ModalBody>
      <ModalFooter >
        {gameStarted && (
          <>
            <Button  onClick={handleGameEnd}>
              Stop Partie
            </Button>
            <Button  onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>

    <Modal isOpen={killer} onClose={closePlayerModal} style={{ zIndex: 2000 }}>
                <ModalHeader>Select a Killer</ModalHeader>

                <ModalBody>
                  <ul>
                    {games &&
                      games.map((game) => {
                        const player = currentlyPlayingPlayers.find(
                          (p) => p?.id === game.playerId
                        );

                        if (player && !game.outAt) {
                          return (
                            <li
                              key={player.id}
                              onClick={() =>
                                handlePlayerKillSelection(player.id)
                              }
                            >
                              {player.name}
                            </li>
                          );
                        } else {
                          return null; // Si le joueur n'est pas trouvé ou est "out", ne rien retourner
                        }
                      })}
                  </ul>
                </ModalBody>

              
</Modal>


    </div>
  );
};

export default StartGame;
