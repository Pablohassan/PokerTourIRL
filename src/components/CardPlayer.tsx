import React from 'react';
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import playerImage from "../../public/ak.jpg";

interface CardPlayerProps {
  playername: string;
  recave: number;
  kill: number;
  rebuy: () => void;
  outOfGame: () => void;
}

export const CardPlayer: React.FC<CardPlayerProps> = ({
  playername,
  recave,
  kill,
  rebuy,
  outOfGame,
}) => {
  return (
    <Card className={cn(
      "w-full max-w-[130px] mx-auto",

      "aspect-[3/5]",
      "bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95 backdrop-blur-md",
      "border  border-slate-500/20",
      "shadow-[0_2px_15px_-3px_rgba(245,158,11,0.15)]",
      "overflow-hidden",
      "transition-all duration-300",
      "hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]",

      "relative",
      "text-shadow-lg"

    )}>
      {/* Background Image with Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-slate-800/50">
          <img
            src={playerImage}
            alt="Card background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col p-1 ">
        <CardHeader className={cn(
          "p-1.5 space-y-0",
          "text-shadow-md",
          "border-b border-amber-400/10",
          "bg-gradient-to-r from-amber-500/10 via-slate-800/80 to-slate-800/80"
        )}>
          <h3 className={cn(
            "font-['DS-DIGI'] text-base text-center",
            "text-shadow-md",
            "text-lg sm:text-xl",
            "text-shadow-lg",
            "text-amber-400 tracking-wide",

            "truncate"
          )}>
            {playername}
          </h3>
        </CardHeader>
        <Button
          variant="outline"
          size="sm"

          onClick={rebuy}
          className={cn(
            "w-full h-7 mb-1 text-sm font-['DS-DIGI']",
            "rounded-[4px]",
            "text-xl",
            "border-amber-400/80 hover:border-amber-400/90 border-2 ",
            "bg-amber-500/5 hover:bg-amber-500/10",
            "text-amber-400 hover:text-amber-300",
            "relative z-20"
          )}
        >
          Recave
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={outOfGame}
          className={cn(
            "w-full h-7  text-sm font-['DS-DIGI']",
            "border-red-400/80 hover:border-red-400/90 border-2",

            "text-shadow-xl",
            "text-lg",
            "text-shadow-xl",
            "shadow-lg",
            "rounded-[4px]",
            "bg-white/5",
            "text-red-400 hover:text-red-500",
            "relative z-20"
          )}
        >
          Eliminé
        </Button>
        <div className="flex-1 flex items-center justify-center p-1">
          <div className="space-y-1 w-full">
            <div className="flex justify-between items-center">
              <span className="text-amber-400/80 text-xl">Recaves</span>
              <span className="font-['DS-DIGI'] text-amber-400 text-xl">{recave}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-amber-400/80 text-xl">Kills</span>
              <span className="font-['DS-DIGI'] text-amber-400 text-xl">{kill}</span>
            </div>
          </div>
        </div>

        <CardContent className={cn(
          "p-1 space-y-1.5",
          "bg-gradient-to-t from-slate-900/95 to-transparent"
        )}>

        </CardContent>
      </div>
    </Card>
  );
};

export default CardPlayer;
