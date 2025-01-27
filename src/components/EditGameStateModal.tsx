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
    blindIndex: number;
    setBlindIndex: (index: number) => void;
    timeLeft: number;
    setTimeLeft: (time: number) => void;
    currentBlindDuration: number;
    setCurrentBlindDuration: (duration: number) => void;
    smallBlind: number;
    bigBlind: number;
    ante: number;
    setSmallBlind: (small: number) => void;
    setBigBlind: (big: number) => void;
    setAnte: (ante: number) => void;
    isPaused: boolean;
    setIsPaused: (paused: boolean) => void;
}

const EditGameStateModal: React.FC<EditGameStateModalProps> = ({
    isOpen,
    onClose,
    games,
    selectedPlayers,
    players,
    onUpdateStats,
    blindIndex,
    setBlindIndex,
    timeLeft,
    setTimeLeft,
    smallBlind,
    bigBlind,
    ante,
    setSmallBlind,
    setBigBlind,
    setAnte,
    isPaused,
    setIsPaused,
}) => {
    const [editedGames, setEditedGames] = React.useState<PlayerStats[]>(games);
    const [editedTimeLeft, setEditedTimeLeft] = React.useState(Math.floor(timeLeft / 60));
    const wasPausedRef = React.useRef(isPaused);

    const blinds = [
        { small: 10, big: 20, ante: 0 },
        { small: 25, big: 50, ante: 0 },
        { small: 50, big: 100, ante: 0 },
        { small: 100, big: 200, ante: 0 },
        { small: 150, big: 300, ante: 0 },
        { small: 200, big: 400, ante: 10 },
        { small: 250, big: 500, ante: 10 },
        { small: 300, big: 600, ante: 25 },
        { small: 400, big: 800, ante: 25 },
        { small: 500, big: 1000, ante: 50 },
        { small: 600, big: 1200, ante: 50 },
        { small: 700, big: 1400, ante: 100 },
        { small: 800, big: 1600, ante: 100 },
        { small: 900, big: 1800, ante: 200 },
        { small: 1000, big: 2000, ante: 200 },
        { small: 1200, big: 2400, ante: 300 },
        { small: 1400, big: 2800, ante: 300 },
        { small: 1600, big: 3200, ante: 400 },
        { small: 1800, big: 3600, ante: 400 },
        { small: 2000, big: 4000, ante: 500 },
        { small: 2200, big: 4400, ante: 500 },
        { small: 2500, big: 5000, ante: 500 },
        { small: 3000, big: 6000, ante: 1000 },
        { small: 3500, big: 7000, ante: 1000 },
        { small: 4000, big: 8000, ante: 2000 },
        { small: 5000, big: 10000, ante: 2000 },
        { small: 6000, big: 12000, ante: 3000 },
        { small: 7000, big: 14000, ante: 3000 },
        { small: 8000, big: 16000, ante: 4000 },
        { small: 9000, big: 18000, ante: 4000 },
        { small: 10000, big: 20000, ante: 5000 },
    ] as const;

    // Pause game when modal opens, store previous pause state
    useEffect(() => {
        if (isOpen) {
            wasPausedRef.current = isPaused;
            setIsPaused(true);
            setEditedGames(games);
            setEditedTimeLeft(Math.floor(timeLeft / 60));
        }
    }, [isOpen, games, timeLeft, isPaused, setIsPaused]);

    const handleClose = () => {
        // Only resume if game wasn't paused before
        if (!wasPausedRef.current) {
            setIsPaused(false);
        }
        onClose();
    };

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
        // Update time left only
        setTimeLeft(editedTimeLeft * 60);
        onUpdateStats(editedGames);
        // Only resume if game wasn't paused before
        if (!wasPausedRef.current) {
            setIsPaused(false);
        }
        onClose();
    };

    const handlePreviousBlind = () => {
        if (blindIndex > 0) {
            const newIndex = blindIndex - 1;
            const { small, big, ante } = blinds[newIndex];
            setBlindIndex(newIndex);
            setSmallBlind(small);
            setBigBlind(big);
            setAnte(ante);
        }
    };

    const handleNextBlind = () => {
        if (blindIndex < blinds.length - 1) {
            const newIndex = blindIndex + 1;
            const { small, big, ante } = blinds[newIndex];
            setBlindIndex(newIndex);
            setSmallBlind(small);
            setBigBlind(big);
            setAnte(ante);
        }
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
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="bg-slate-900 border-amber-400/20 max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-['DS-DIGI'] text-amber-400">Edit Game State</DialogTitle>
                </DialogHeader>

                {/* Timer and Blind Controls */}
                <div className="mb-6 p-4 rounded-lg border border-amber-400/20 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Timer Settings */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-['DS-DIGI'] text-amber-400">Timer Settings</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-amber-400/80 block mb-2">Time Left (minutes)</label>
                                    <input
                                        type="number"
                                        value={editedTimeLeft}
                                        onChange={(e) => setEditedTimeLeft(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-slate-800 text-amber-400 border border-amber-400/20 rounded p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Blind Controls */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-['DS-DIGI'] text-amber-400">Blind Controls</h3>
                            <div className="flex items-center justify-between gap-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePreviousBlind}
                                    disabled={blindIndex === 0}
                                    className="text-amber-400 border-amber-400/20"
                                >
                                    Previous Level
                                </Button>
                                <div className="text-center">
                                    <div className="text-amber-400/80">Current Level</div>
                                    <div className="text-amber-400 text-lg">{blindIndex + 1}</div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={handleNextBlind}
                                    disabled={blindIndex >= blinds.length - 1}
                                    className="text-amber-400 border-amber-400/20"
                                >
                                    Next Level
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center">
                                    <div className="text-amber-400/80">Small</div>
                                    <div className="text-amber-400">{smallBlind}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-amber-400/80">Big</div>
                                    <div className="text-amber-400">{bigBlind}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-amber-400/80">Ante</div>
                                    <div className="text-amber-400">{ante}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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