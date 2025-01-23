import React from 'react';
import { Player, Tournaments } from './interfaces';
import bgReview from '../assets/reviewpoker.png';
import { useNavigate } from 'react-router-dom';
import { cn } from "../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface ReviewSelectedPlayersProps {
  selectedPlayers: Player[];
  selectedTournament: Tournaments | null;
  onConfirm: () => void;
}

const blindLevels = [
  { level: 1, small: 10, big: 20, duration: '20m' },
  { level: 2, small: 25, big: 50, duration: '20m' },
  { level: 3, small: 50, big: 100, duration: '20m' },
  { level: 4, small: 100, big: 200, duration: '20m' },
  { level: 5, small: 150, big: 300, duration: '20m' },
  { level: 6, small: 200, big: 400, duration: '20m' },
  { level: 7, small: 300, big: 600, duration: '20m' },
  { level: 8, small: 400, big: 800, duration: '20m' },
  { level: 9, small: 500, big: 1000, duration: '20m' },
  { level: 10, small: 600, big: 1200, duration: '20m' },
  { level: 11, small: 700, big: 1400, duration: '20m' },
  { level: 12, small: 800, big: 1600, duration: '20m' },
  { level: 13, small: 900, big: 1800, duration: '20m' },
  { level: 14, small: 1000, big: 2000, duration: '20m' },
  { level: 15, small: 1500, big: 3000, duration: '20m' },
  { level: 16, small: 2000, big: 4000, duration: '20m' },
];

const columns = [
  { key: "level", label: "Level" },
  { key: "small", label: "Small Blind" },
  { key: "big", label: "Big Blind" },
  { key: "duration", label: "Duration" },
];

const ReviewSelectedPlayers: React.FC<ReviewSelectedPlayersProps> = ({
  selectedPlayers,
  selectedTournament,
  onConfirm
}) => {
  const navigate = useNavigate();

  return (
    <div className={cn(
      "min-h-screen w-full",
      "bg-cover bg-center",
      "flex items-center justify-center",
      "p-4 sm:p-6",
      "overflow-y-auto"
    )}
      style={{
        backgroundImage: `url(${bgReview})`
      }}>
      <Card className={cn(
        "w-full max-w-[980px]",
        "bg-gradient-to-b from-slate-950/90 to-slate-800/95 backdrop-blur-md",
        "border border-amber-400/20",
        "shadow-[0_0_35px_-5px_rgba(245,158,11,0.15)]",
        "rounded-2xl overflow-hidden"
      )}>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Tournament Title */}
            {selectedTournament && (
              <CardHeader className="px-0 pt-0">
                <CardTitle className={cn(
                  "font-['DS-DIGI'] text-2xl sm:text-3xl text-amber-400/90",
                  "tracking-wider"
                )}>
                  Tournament: {selectedTournament.year}
                </CardTitle>
              </CardHeader>
            )}

            {/* Players Grid */}
            <div className="space-y-4">
              <h3 className={cn(
                "font-['DS-DIGI'] text-xl sm:text-2xl text-amber-400/80",
                "tracking-wide"
              )}>
                Selected Players
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {selectedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className={cn(
                      "p-3 rounded-xl",
                      "bg-slate-950/90",
                      "border border-amber-400/20",
                      "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
                      "font-['DS-DIGI'] text-lg sm:text-xl text-amber-400/90",
                      "tracking-wide"
                    )}
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Blinds Structure */}
            <div className="space-y-4">
              <h3 className={cn(
                "font-['DS-DIGI'] text-xl sm:text-2xl text-amber-400/80",
                "tracking-wide"
              )}>
                Blinds Structure
              </h3>
              <div className={cn(
                "rounded-xl overflow-hidden",
                "border border-amber-400/20",
                "shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]"
              )}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-950/90">
                        {columns.map((column) => (
                          <th
                            key={column.key}
                            className={cn(
                              "p-3 text-left",
                              "font-['DS-DIGI'] text-lg text-amber-400/80",
                              "tracking-wide",
                              "border-b border-amber-400/20"
                            )}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {blindLevels.map((item) => (
                        <tr
                          key={item.level}
                          className="border-b border-amber-400/10 last:border-0 hover:bg-slate-950/30"
                        >
                          {columns.map((column) => (
                            <td
                              key={column.key}
                              className={cn(
                                "p-3",
                                "font-['DS-DIGI'] text-base sm:text-lg text-amber-400/90",
                                "tracking-wide"
                              )}
                            >
                              {item[column.key as keyof typeof item]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={onConfirm}
                className={cn(
                  "flex-1",
                  "font-['DS-DIGI'] text-lg",
                  "bg-amber-500/80 hover:bg-amber-500/60",
                  "text-slate-900 hover:text-slate-900",
                  "border border-amber-400/20",
                  "h-12"
                )}
              >
                Confirm and Start Game
              </Button>
              <Button
                onClick={() => navigate("/partypage")}
                variant="secondary"
                className={cn(
                  "flex-1",
                  "font-['DS-DIGI'] text-lg",
                  "bg-slate-800/80 hover:bg-slate-800/60",
                  "text-amber-400",
                  "border border-amber-400/20",
                  "h-12"
                )}
              >
                Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSelectedPlayers;
