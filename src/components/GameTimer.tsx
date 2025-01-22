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
      "min-h-[370px]"
    )}>
      <CardContent className="p-4 rounded-2xl">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Timer Display - Full width on mobile, 2 cols on tablet */}
          <div className={cn(
            "sm:col-span-2 lg:col-span-1",
            "rounded-xl",
            "flex flex-col justify-center items-center",
            "bg-slate-950/90 p-4",
            "border border-amber-400/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
            "min-h-[240px] sm:min-h-[240px]"
          )}>
            <span className="font-['DS-DIGI'] text-amber-400/80 text-5xl mb-2">
              Time Left
            </span>
            <span className={cn(
              "font-['DS-DIGI'] text-amber-400",
              "text-5xl sm:text-[2.5em] md:text-9xl",
              "tabular-nums tracking-wider"
            )}>
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Blinds Display */}
          <div className={cn(
            "flex flex-col justify-between",
            "bg-slate-950/90 rounded-xl p-4",
            "border border-amber-400/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
            "min-h-[220px]"
          )}>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-3xl">Small</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-5xl">{smallBlind}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-3xl">Big</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-5xl">{bigBlind}</span>
              </div>
              <div className="h-px bg-amber-400/20 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-3xl">Ante</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-5xl">{ante}</span>
              </div>
            </div>
          </div>

          {/* Stack Info */}
          <div className={cn(
            "flex flex-col justify-between",
            "bg-slate-950/90 rounded-xl p-4",
            "border border-amber-400/20",
            "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
            "min-h-[220px]"
          )}>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-3xl">Pot</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-5xl">{totalPot}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-['DS-DIGI'] text-amber-400/80 text-2xl">M-Stack</span>
                <span className="font-['DS-DIGI'] text-amber-400 text-2xl sm:text-5xl">{middleStack}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-amber-400/20">
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
            size="lg"
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              "font-['DS-DIGI'] text-lg sm:text-xl",
              "px-6 sm:px-8",
              "h-10 sm:h-16",
              "rounded-2xl",
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
