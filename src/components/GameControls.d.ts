import * as React from "react";
import { Player } from "./interfaces";

export type OutPlayer = Player & {
  position?: number | null;
  playerName?: string | null;
  playerId?: number | null;
  points?: number | null;
};

export interface GameControlsProps {
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
}

declare const GameControls: React.FC<GameControlsProps>;
export default GameControls;
