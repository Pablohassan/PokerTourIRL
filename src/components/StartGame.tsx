import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import SelectPlayersGame from "./SelectPlayersGame";
import { Content } from './Content'
import ReviewSelectedPlayers from "../components/ReviewSelectedPlayers"
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalContent,
  ButtonGroup,
} from "@nextui-org/react";
import { Player, PlayerStats, Parties } from './interfaces';
import { CardPlayer } from "./CardPlayer";
import BlindTimer from "./BlindTimer";
import GameTimer from "./GameTimer";
import DSdigital from "../assets/fonts/DS-DIGI.ttf";

import toast from "react-hot-toast";
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
  const [showReview, setShowReview] = useState(false);
  const [pot, setPot] = useState(0)
  const [games, setGames] = useState<PlayerStats[]>([]);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [smallBlind, setSmallBlind] = useState(10);
  const [bigBlind, setBigBlind] = useState(20);
  const [ante, setAnte] = useState(0)
  const [outPlayers, setOutPlayers] = useState<Player[]>([]);
  const [initialPlayerCount, setInitialPlayerCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTournamentId, setSelectedTournamentId] = useState<number | null>(null);
  const [playerOutGame, setPlayerOutGame] = useState<number | null>(null);
  const [killer, setKiller] = useState(false);
  const [isSelectPlayersModalOpen, setIsSelectPlayersModalOpen] = useState(true);
  const [rebuyPlayerId, setRebuyPlayerId] = useState<number | null>(null);
  const [partyStarted, setPartyStarted] = useState(null);
  const [currentParty, setCurrentParty] = useState(null);
  const [partyId, setPartyId] = useState(false);
  const [partyEnded, setPartyEnded] = useState(null);
  const [middleStack, setMiddleStack] = useState(5350);
  const [totalStack, setTotalStack] = useState(0);

  console.log("pot", pot)

  useEffect(() => {
    const restoreState = async () => {
      if (!gameStarted) {
        // Fetch data from your API or localStorageh
        const savedState = localStorage.getItem('gameState');
        if (savedState) {
          const {
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
            showReview,
            selectedPlayers

          } = JSON.parse(savedState);
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
          setSelectedPLayers(selectedPlayers)
          setGameStarted(true);  // Now, the game is restored
          setShowReview(showReview)

        }
        console.log(selectedPlayers)
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
        } catch (error) {
          console.error('Failed to fetch party state:', error);
        }
      };

      fetchPartyState();
    }
  }, [partyId]);


  useEffect(() => {
    if (!gameStarted) {
      console.log('Initializing totalStack based on selectedPlayers.length:', selectedPlayers.length);
      setTotalStack(selectedPlayers.length * 5350);
      // Mark the game as initialized
    }
  }, [selectedPlayers.length, gameStarted]);


  useEffect(() => {
    if (gameStarted && initialPlayerCount > 0 && pot === 0) {
      const initialPot = initialPlayerCount * 5;
      setPot(initialPot);

    }

  }, [gameStarted, initialPlayerCount, pot]);



  useEffect(() => {
    // Recalculate middle stack whenever the total stack or player count changes
    const remainingPlayers = selectedPlayers.length;
    if (remainingPlayers > 0) { // Avoid division by zero
      const newMiddleStack = totalStack / remainingPlayers;
      const roundedMiddleStack = Math.round(newMiddleStack);
      setMiddleStack(roundedMiddleStack);
    }
  }, [totalStack, selectedPlayers.length]);

  useEffect(() => {
    // Recalculate middle stack whenever the total stack or player count changes
    const remainingPlayers = selectedPlayers.length;
    if (remainingPlayers > 0) { // Avoid division by zero
      const newMiddleStack = totalStack / remainingPlayers;
      const roundedMiddleStack = Math.round(newMiddleStack);
      setMiddleStack(roundedMiddleStack);
    }
  }, [totalStack, selectedPlayers.length]);


  const navigate = useNavigate();

  const onStartGameReview = () => {
    setShowReview(true);
  };

  const confirmAndStartGame = async () => {
    setShowReview(false); // Hide the review
    await onStartGame();  // Now, start the game

  };

  const renderOutOfGamePlayers = () => {
    return outPlayers.map((player, index) => {
      const gameForPlayer = games.find(game => game.playerId === player.id);
      const position = gameForPlayer?.position ?? 'N/A';  // If position is undefined, fallback to 'N/A'

      return (
        <div key={player.id} className="out-player">
          <div style={{ display: 'inline-block', margin: "20px", fontSize: "1.5em" }}>{player.name} : <div style={{ display: 'inline-block', marginRight: "10px" }}>Position {position}</div> </div>

        </div>
      );
    });
  };


  const noTournaments = championnat.length === 0;

  const saveGameState = () => {
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
      showReview,
      selectedPlayers

    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  const currentlyPlayingPlayers = games
    .filter((game) => !game.outAt)
    .map((game) => {
      return players.find((player) => player.id === game.playerId);
    });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
      toast("Failed to start new game");
    }
    setInitialPlayerCount(selectedPlayers.length);


    saveGameState()
    // setSelectPlayersModalOpen(false);
  };


  const handleRebuy = (playerId: number) => {
    if (window.confirm("Is this player payed the rebuy?")) {
      setRebuyPlayerId(playerId);
      setKiller(true);
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
    setTotalStack((prevTotalStack) => prevTotalStack + 5350);
    setPot(prevPot => prevPot + 4);
    saveGameState();
  };
  const calculatePoints = (position: number, isWinner: boolean = false) => {
    if (isWinner) {
      return initialPlayerCount;  // Maximum points for the winner
    }
    return initialPlayerCount - position + 1;
  };

  const points = calculatePoints(outPlayers.length);
  console.log("Calculated Points:", points);

  const updateKiller = async (killerPlayerId: number, partyId: number) => {
    setGames((prevGames) =>
      prevGames.map((game) =>
        game.playerId === killerPlayerId
          ? { ...game, kills: game.kills + 1 }
          : game
      )
    );
    setKiller(false); // Close the modal for selecting the killer
    setRebuyPlayerId(null);
    // Any other logic that you need to add for the killer
  };

  const handlePlayerKillSelection = async (killerPlayerId: number, partyId: number) => {
    if (window.confirm("Do you want to select this player as the killer?")) {
      await updateKiller(killerPlayerId, partyId);
    }
  };
  const handleOutOfGame = async (
    partyId: number,
    playerId: number,
    eliminatedById: number | null
  ) => {
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
            partyId: partyId, // Remplacez par l'ID de la partie en cours
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
          saveGameState();
        } catch (error: any) {
          console.error("An error occurred while updating player stats:");
          console.error("Error object:", error);
          if (error.response) {
            console.error("Server responded with:", error.response.data);
          }
          if (error.request) {
            console.error(
              "The request was made but no response was received:",
              error.request
            );
          }
        }
      }
    }
  };

  const handleGameEnd = async () => {
    // Automatically end the game if only one player is left
    if (currentlyPlayingPlayers.length === 1) {
      // Proceed with ending the game
      let updatedGames = [...games];
      const position = initialPlayerCount - outPlayers.length;
      const points = calculatePoints(position);
      const winningPlayerId = currentlyPlayingPlayers[0]?.id;
      const outAt = new Date();
  
      updatedGames = updatedGames.map((game) =>
        game.playerId === winningPlayerId
          ? { ...game, points: points, outAt: outAt, position: position }
          : game
      );
  
      try {
        const res = await api.post("/gameResults", updatedGames);
        updateAfterGameEnd(updatedGames);
      } catch (error) {
        console.error("Error:", error);
      }
  
      setGameStarted(false);
      setPartyId(false);
      localStorage.removeItem('gameState');
      navigate("/results");
    } else {
      // If more than one player is left, show a message or handle accordingly
      alert("The game cannot be ended yet as more than one player is still playing.");
    }
  };
  



  return (
    <div style={{
      maxWidth: '90%',
      maxHeight: '90vh',
      margin: 'auto',
      overflow: 'auto'
    }}>

      <Modal isOpen={killer} >
        <ModalContent>
          <ModalHeader className="with-full height-full">
            Select a Killer
          </ModalHeader>

          <ModalBody>
            <div color="danger">
              {games &&
                games.map((game) => {
                  const player = currentlyPlayingPlayers.find(
                    (p) => p?.id === game.playerId
                  );

                  if (player && !game.outAt && player.id !== rebuyPlayerId && player.id !== playerOutGame) {
                    return (
                      <ButtonGroup style={{ padding: "2px" }}>
                        <Button
                          variant="bordered"
                          color="warning"
                          className="text-lg p-2 m-1"
                          key={player.id}
                          onClick={() => handlePlayerKillSelection(player.id, game.partyId)}
                        >
                          {player.name}
                        </Button>
                      </ButtonGroup>
                    );
                  } else {
                    return null; // Si le joueur n'est pas trouvé ou est "out", ne rien retourner
                  }
                })}
            </div>
          </ModalBody>

        </ModalContent>
      </Modal>
      <Modal isOpen={!gameStarted && !currentParty}>
        <ModalHeader>Select Players and Game Details</ModalHeader>
        <ModalBody>
          <Modal isOpen={isSelectPlayersModalOpen} >
            <SelectPlayersGame
              players={players}
              selectedPlayers={selectedPlayers}
              handlePlayerSelect={handlePlayerSelect}
              onStartGame={onStartGameReview}
              championnat={championnat}
              selectedTournamentId={selectedTournamentId}
              setSelectedTournamentId={setSelectedTournamentId}

            />

          </Modal>
        </ModalBody>
      </Modal>
      {
        showReview && !partyId ? (
          <ReviewSelectedPlayers selectedPlayers={selectedPlayers} onConfirm={confirmAndStartGame} />
        ) : (

          <div >

            <Modal isOpen={gameStarted} onClose={handleGameEnd}>
              <ModalHeader className="text-xl bg-color-red">Game in Progress</ModalHeader>
              <Content championnat={championnat} />
              <ModalBody>

                <div
                  style={{
                    margin: "10 auto",
                    height: '200px'

                  }}
                >
                  <BlindTimer
                    gameStarted={gameStarted}
                    isPaused={isPaused}
                    // Handle the blind change here
                    onBlindChange={(small, big, ante) => {
                      setSmallBlind(small);
                      setBigBlind(big);
                      setAnte(ante)
                    }}
                    onTimeChange={(time) => {
                      // Handle time change here
                      setTimeLeft(time);
                    }} />


                  {gameStarted && (
                    <div >
                      <GameTimer
                        formatTime={formatTime}
                        timeLeft={timeLeft}
                        smallBlind={smallBlind}
                        bigBlind={bigBlind}
                        ante={ante}
                        handleGameEnd={handleGameEnd}
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}
                        totalPot={pot}
                        middleStack={middleStack}
                      />

                      <div style={{ fontSize: "20px" }}>


                      </div>

                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {currentlyPlayingPlayers.map((player) => {
                      // Trouver le jeu correspondant au joueur actuel
                      const gameForPlayer = games.find(
                        (game) => game.playerId === player?.id
                      );
                      // Si le jeu existe pour ce joueur, affichez les détails, sinon affichez une erreur
                      return (

                        <div
                          key={player?.id}
                          style={{ display: "flex", flexDirection: "column", }}
                        >

                          {gameForPlayer ? (
                            <div className="p-1" >
                              <CardPlayer
                                playername={player?.name ?? " none"}
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
                            </div>
                          ) : (
                            <div>Erreur: Pas de jeu pour {player?.name}</div>
                          )}

                        </div>
                      );
                    })}
                    <div style={{
                      position: 'absolute', // or 'fixed' if you want it to stay in the same place even when scrolling
                      right: '10%', marginLeft: "20px", marginTop: "10px", border: "solid 2px", borderRadius: "5%"
                    }}>

                      <div style={{ margin: "20px", fontSize: "1.5em" }}>Joueurs Sortis</div>
                      <div style={{ width: "100%", marginTop: "10px", height: "2px", border: "solid" }}></div>
                      <div >  {renderOutOfGamePlayers()}</div>
                    </div>
                  </div>
                </div>

              </ModalBody>

            </Modal>
          </div>
        )}
    </div>
  );
};

export default StartGame;