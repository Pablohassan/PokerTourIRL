import React from "react";
import { CardPlayer } from "./CardPlayer";
import { Player, PlayerStats } from './interfaces';
import { cn } from "../lib/utils";

interface PlayerListProps {
  players: Player[];
  games: PlayerStats[];
  handleRebuy: (playerId: number) => void;
  handleOutOfGame: (partyId: number, playerId: number, eliminatedById: number | null) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, games, handleRebuy, handleOutOfGame }) => {
  console.log('PlayerList render:', {
    playersCount: players.length,
    gamesCount: games.length,
    players,
    games
  });

  return (
    <div className={cn(
      "w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-8 lg:grid-cols-8 xl:grid-cols-8",
      "gap-1 ",

      "rounded-lg border border-amber-400/10",
      "shadow-[0_0_25px_-5px_rgba(245,158,11,0.15)]"
    )}>
      {players.map((player) => {
        const gameForPlayer = games.find((game) => game.playerId === player.id);
        if (!gameForPlayer) {
          console.error(`No game data found for player ${player.name}`);
          return (
            <div key={player.id} className={cn(
              "p-2 rounded-lg",
              "bg-red-950/50 backdrop-blur-md",
              "border border-red-400/20",
              "text-red-400 text-sm",
              "shadow-[0_0_15px_-3px_rgba(239,68,68,0.2)]"
            )}>
              Erreur: Pas de jeu pour {player.name}
            </div>
          );
        }
        return (
          <div key={player.id} className="flex flex-col">
            <CardPlayer
              key={player.id}
              playername={player?.name ?? "none"}
              recave={gameForPlayer.rebuys}
              kill={gameForPlayer.kills}
              rebuy={() => handleRebuy(gameForPlayer.playerId)}
              outOfGame={() => handleOutOfGame(gameForPlayer.partyId, gameForPlayer.playerId, gameForPlayer.eliminatedById)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;
