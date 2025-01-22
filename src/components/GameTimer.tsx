import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface GameTimerProps {
  formatTime: (time: number) => string;
  totalPot: number;
  middleStack: number;
  timeLeft: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  handleGameEnd: () => void;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameTimer: React.FC<GameTimerProps> = ({
  middleStack,
  totalPot,
  formatTime,
  timeLeft,
  smallBlind,
  bigBlind,
  // handleGameEnd,
  isPaused,
  setIsPaused,
  ante
}) => {
  return (
    <Card className={cn(
      "w-full max-w-full mx-auto",
      "bg-gradient-to-b from-slate-950/90 to-slate-800/95 backdrop-blur-md border-amber-400/20",
      "rounded-2xl",
      "shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]",
      "overflow-hidden",
      "min-h-[200px]"
    )}>
      <CardContent className="p-2 sm:p-3 rounded-2xl">
        {/* Main Grid */}
        <div className="grid grid-cols-2 [&>*:first-child]:col-span-2 gap-2 sm:gap-3 [&>*:first-child]:min-[900px]:col-span-1 min-[900px]:grid-cols-3">
          {/* Timer Display */}
          <div className={cn(
            "rounded-xl",
            "flex flex-col justify-center items-center",
            "bg-slate-950/90 p-2 sm:p-3",
            "border border-amber-400/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
            "min-h-[120px] sm:min-h-[160px]"
          )}>
            <span className="font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl mb-1">
              Time Left
            </span>
            <span className={cn(
              "font-['DS-DIGI'] text-amber-400",
              "text-4xl sm:text-6xl min-[900px]:text-7xl",
              "tabular-nums tracking-wider"
            )}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Blinds Display */}
          <div className={cn(
            "flex flex-col justify-between",
            "bg-slate-950/90 rounded-xl p-2 sm:p-3",
            "border border-amber-400/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
            "min-h-[120px] sm:min-h-[160px]"
          )}>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl">Small</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl">{smallBlind}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl">Big</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl">{bigBlind}</span>
              </div>
              <div className="h-px bg-amber-400/20 my-1 sm:my-2" />
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl">Ante</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl">{ante}</span>
              </div>
            </div>
          </div>

          {/* Stack Info */}
          <div className={cn(
            "flex flex-col justify-between",
            "bg-slate-950/90 rounded-xl p-2 sm:p-3",
            "border border-amber-400/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
            "min-h-[120px] sm:min-h-[160px]"
          )}>
            <div className="space-y-2 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl">Pot</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl">{totalPot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-xl sm:text-2xl">M-Stack</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-4xl">{middleStack}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-2 mt-2 pt-2 border-t border-amber-400/20">
          {/* <Button
            variant="destructive"
            size="lg"
            onClick={handleGameEnd}
            className={cn(
              "font-['DS-DIGI'] text-lg sm:text-xl",
              "px-8 sm:px-8",
              "h-20 sm:h-16",
              "rounded-2xl"
            )}
          >
            Stop Game
          </Button> */}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "font-['DS-DIGI'] text-base sm:text-lg",
              "px-4 sm:px-6",
              "h-8 sm:h-10",
              "rounded-xl",
              "bg-amber-500/80 hover:bg-amber-500/20",
              "text-slate-900 hover:text-slate-700",
              "border border-amber-400/20"
            )}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(GameTimer);
