import React from 'react';
import { Player, PlayerStats } from './interfaces';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface KillerSelectionModalProps {
  killer: boolean;
  games: PlayerStats[];
  currentlyPlayingPlayers: Player[];
  rebuyPlayerId: number | null;
  playerOutGame: number | null;
  handlePlayerKillSelection: (killerPlayerId: number) => void;
}

const KillerSelectionModal: React.FC<KillerSelectionModalProps> = ({
  killer,
  games,
  currentlyPlayingPlayers,
  rebuyPlayerId,
  playerOutGame,
  handlePlayerKillSelection,
}) => {
  if (!killer) return null;

  console.log('KillerSelectionModal render:', {
    killer,
    playersCount: currentlyPlayingPlayers.length,
    rebuyPlayerId,
    playerOutGame
  });

  // Get the player being acted upon (either rebuy or elimination)
  const affectedPlayer = games.find(game =>
    game.playerId === (rebuyPlayerId || playerOutGame)
  );

  // Filter out the affected player from the killer selection list
  const availableKillers = currentlyPlayingPlayers.filter(player =>
    player.id !== (rebuyPlayerId || playerOutGame)
  );

  return (
    <Dialog open={killer} onOpenChange={() => { }}>
      <DialogContent className={cn(
        "bg-zinc-900",
        "border-2 border-blue-500",
        "backdrop-blur-md",
        "shadow-lg shadow-black/25",
        "max-w-[90vw] sm:max-w-[600px]",
        "p-6"
      )}>
        <DialogHeader>
          <DialogTitle
            style={{
              textShadow: "2px 2px 10px 2px rgba(0, 0, 0, 0.3)",
            }}
            className={cn(
              "font-['DS-DIGI']",

              "text-3xl sm:text-4xl",
              "text-center",
              "text-white",
              "tracking-wider",
              "font-bold"
            )}>
            Select the Killer
          </DialogTitle>
          {affectedPlayer && (
            <div className={cn(
              "text-center",
              "text-blue-200/90",
              "font-['DS-DIGI']",
              "text-xl",
              "leading-relaxed",
              "mt-4"
            )}>
              Who eliminated{" "}
              <span className="font-bold">
                {currentlyPlayingPlayers.find(p => p.id === affectedPlayer.playerId)?.name}
              </span>?
            </div>
          )}
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {availableKillers.map((player) => {
            const playerGame = games.find((game) => game.playerId === player.id);
            if (!playerGame) return null;

            return (
              <Button
                key={player.id}
                onClick={() => handlePlayerKillSelection(player.id)}
                className={cn(
                  "bg-gradient-to-br from-blue-500 to-blue-600",

                  "hover:from-blue-600 hover:to-blue-700",
                  "text-white font-semibold",
                  "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
                  "hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]",
                  "hover:scale-110",
                  "font-['DS-DIGI']",
                  "text-lg",
                  "px-6 py-4",
                  "transition-all duration-200",
                  "flex flex-col items-center gap-2",
                  "border-0"
                )}
              >
                <span className="font-bold">{player.name}</span>

              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KillerSelectionModal;
