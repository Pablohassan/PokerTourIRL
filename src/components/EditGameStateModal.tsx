import React, { useEffect } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { cn } from "../lib/utils";
import { PlayerStats } from './interfaces';

interface EditGameStateModalProps {
    isOpen: boolean;
    onClose: () => void;
    games: PlayerStats[];
    selectedPlayers: any[];
    players: any[];
    onUpdateStats: (updatedGames: PlayerStats[]) => void;
}

const EditGameStateModal: React.FC<EditGameStateModalProps> = ({
    isOpen,
    onClose,
    games,
    selectedPlayers,
    players,
    onUpdateStats,
}) => {
    const [editedGames, setEditedGames] = React.useState<PlayerStats[]>(games);

    // Reset edited games when modal is opened with new games
    useEffect(() => {
        if (isOpen) {
            setEditedGames(games);
        }
    }, [isOpen, games]);

    const handleIncrement = (playerId: number, field: 'rebuys' | 'kills') => {
        setEditedGames(prevGames =>
            prevGames.map(game =>
                game.playerId === playerId
                    ? { ...game, [field]: (game[field] || 0) + 1 }
                    : game
            )
        );
    };

    const handleDecrement = (playerId: number, field: 'rebuys' | 'kills') => {
        setEditedGames(prevGames =>
            prevGames.map(game =>
                game.playerId === playerId && game[field] > 0
                    ? { ...game, [field]: (game[field] || 0) - 1 }
                    : game
            )
        );
    };

    const handleToggleInGame = (playerId: number) => {
        setEditedGames(prevGames =>
            prevGames.map(game =>
                game.playerId === playerId
                    ? { ...game, outAt: game.outAt ? null : new Date() }
                    : game
            )
        );
    };

    const handleSave = () => {
        onUpdateStats(editedGames);
        onClose();
    };

    // Sort games to show in-game players first, then out-of-game players
    const sortedGames = [...editedGames].sort((a, b) => {
        // First sort by in-game status
        if (!a.outAt && b.outAt) return -1;
        if (a.outAt && !b.outAt) return 1;
        // Then sort eliminated players by position
        if (a.outAt && b.outAt) {
            return (a.position || 0) - (b.position || 0);
        }
        return 0;
    });

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-slate-900 border-amber-400/20 max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-['DS-DIGI'] text-amber-400">Edit Game State</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {sortedGames.map((game) => {
                        const player = selectedPlayers.find(p => p.id === game.playerId) ||
                            players.find(p => p.id === game.playerId);
                        if (!player) return null;

                        return (
                            <div
                                key={game.playerId}
                                className={cn(
                                    "p-4 rounded-lg",
                                    "border border-amber-400/20",
                                    "bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95",
                                    game.outAt ? "opacity-75" : "opacity-100"
                                )}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-['DS-DIGI'] text-amber-400">{player?.name}</h3>
                                    {game.outAt && (
                                        <span className="text-red-400 text-sm">
                                            Position: {game.position || 'N/A'}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-amber-400/80">Recaves</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDecrement(game.playerId, 'rebuys')}
                                                className="text-amber-400 border-amber-400/20 h-4 w-10 p-0 rounded-[5px]"
                                            >
                                                -
                                            </Button>
                                            <span className="font-['DS-DIGI'] text-amber-400 w-8 text-center">
                                                {game.rebuys || 0}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleIncrement(game.playerId, 'rebuys')}
                                                className="text-amber-400 border-amber-400/20 h-8 w-8 p-0 rounded-xl"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-amber-400/80">Kills</span>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDecrement(game.playerId, 'kills')}
                                                className="text-amber-400 border-amber-400/20 h-4 w-10 p-0 rounded-[5px]"
                                            >
                                                -
                                            </Button>
                                            <span className="font-['DS-DIGI'] text-amber-400 w-8 text-center">
                                                {game.kills || 0}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleIncrement(game.playerId, 'kills')}
                                                className="text-amber-400 border-amber-400/20 h-8 w-8 p-0 rounded-xl"
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleInGame(game.playerId)}
                                        className={cn(
                                            "w-full",
                                            game.outAt
                                                ? "text-green-400 border-green-400/20 rounded-[5px]"
                                                : "text-red-400 border-red-400/20 rounded-[5px]"
                                        )}
                                    >
                                        {game.outAt ? "Retour au jeu" : "Marquer comme sorti"}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="text-red-400 border-red-400/20"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSave}
                        className="text-amber-400 border-amber-400/20"
                    >
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default EditGameStateModal; 