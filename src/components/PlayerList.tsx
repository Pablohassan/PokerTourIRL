import React from "react";
import { CardPlayer } from "./CardPlayer";
import { Player, PlayerStats } from './interfaces';

interface PlayerListProps {
  players: Player[];
  games: PlayerStats[];
  handleRebuy: (playerId: number) => void;
  handleOutOfGame: (partyId: number, playerId: number, eliminatedById: number | null) => void;
  style?: React.CSSProperties;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, games, handleRebuy, handleOutOfGame }) => {

  return (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {players.map((player) => {
        const gameForPlayer = games.find((game) => game.playerId === player.id);
        if (!gameForPlayer) {
          console.error(`No game data found for player ${player.name}`);
          return (
            <div key={player.id}>
              Erreur: Pas de jeu pour {player.name}
            </div>
          );
        }
        return (
          <div key={player.id} style={{ display: "flex", flexDirection: "column" }}>
            <div className="p-1">
              <CardPlayer
                key={player.id}
                playername={player?.name ?? "none"}
                recave={gameForPlayer.rebuys}
                kill={gameForPlayer.kills}
                rebuy={() => handleRebuy(gameForPlayer.playerId)}
                outOfGame={() => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;
