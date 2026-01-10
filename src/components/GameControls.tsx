import React, { useRef } from "react";
import BlindTimer from "./BlindTimer";
import GameTimer from "./GameTimer";
import { cn } from "../lib/utils";
import { Player } from "./interfaces";

type OutPlayer = Player & { position?: number | null; playerName?: string | null; playerId?: number | null; points?: number | null };

interface GameControlsProps {
  gameStarted: boolean;
  isPaused: boolean;
  timeLeft: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  handleGameEnd: () => void;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  pot: number;
  middleStack: number;
  totalRebuys: number;
  outPlayers: OutPlayer[];
  setSmallBlind: React.Dispatch<React.SetStateAction<number>>;
  setBigBlind: React.Dispatch<React.SetStateAction<number>>;
  setAnte: React.Dispatch<React.SetStateAction<number>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  blindIndex: number;
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>;
  initialTimeLeft: number;
  style?: React.CSSProperties;
  socketConnected?: boolean;
  serverNextBlind?: { small: number; big: number; ante: number } | null;
  socketPauseTimer?: () => void;
  socketResumeTimer?: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  isPaused,
  timeLeft,
  smallBlind,
  bigBlind,
  ante,
  handleGameEnd,
  setIsPaused,
  pot,
  middleStack,
  totalRebuys,
  outPlayers,
  setSmallBlind,
  setBigBlind,
  setAnte,
  setTimeLeft,
  blindIndex,
  setBlindIndex,
  initialTimeLeft,
  socketConnected = false,
  serverNextBlind = null,
  socketPauseTimer,
  socketResumeTimer,
}) => {
  const isUpdatingRef = useRef(false);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!gameStarted) return null;

  return (
    <div className={cn(
      "w-full max-w-[1010px] min-h-[300px] mx-auto",
      "bg-slate-950/95 backdrop-blur-md",
      "border border-amber-400/10",
      "shadow-[0_0_35px_-5px_rgba(245,158,11,0.15)]",
      "rounded-2xl overflow-hidden"
    )}>
      <div className="space-y-2">
        <BlindTimer
          gameStarted={gameStarted}
          isPaused={isPaused}
          onBlindChange={(small, big, ante) => {
            if (isUpdatingRef.current) return;
            isUpdatingRef.current = true;
            try {
              setSmallBlind(small);
              setBigBlind(big);
              setAnte(ante);
            } finally {
              isUpdatingRef.current = false;
            }
          }}
          onTimeChange={(time) => {
            if (isUpdatingRef.current) return;
            setTimeLeft(time);
          }}
          blindIndex={blindIndex}
          setBlindIndex={setBlindIndex}
          initialTimeLeft={initialTimeLeft}
          // @ts-ignore timeLeft is not used in BlindTimer
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          socketConnected={socketConnected}
          serverNextBlind={serverNextBlind}
        />
        <GameTimer
          timeLeft={timeLeft}
          smallBlind={smallBlind}
          bigBlind={bigBlind}
          ante={ante}
          handleGameEnd={handleGameEnd}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          totalPot={pot}
          middleStack={middleStack}
          totalRebuys={totalRebuys}
          outPlayers={outPlayers}
          formatTime={formatTime}
          socketConnected={socketConnected}
          socketPauseTimer={socketPauseTimer}
          socketResumeTimer={socketResumeTimer}
        />
      </div>
    </div>
  );
}

export default GameControls;
