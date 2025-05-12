import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface Player {
  id: number;
  name: string;
}

interface Game {
  id: number;
  points: number;
  rebuys: number;
  buyin: number,
  playerId: number;
  totalCost: number;
  outAt: Date | null;
  partyId: number;
}

interface Props {
  players: Player[],
  playerScores: Game[],
  selectedPlayers: Player[],
  handlePlayerSelect: (playerId: number) => void
}

export const PlayerRanking: React.FC<Props> = ({ players, playerScores, selectedPlayers, handlePlayerSelect }) => {
  const navigate = useNavigate();

  const handlePlayerClick = (playerId: number) => {
    navigate(`/player/${playerId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-5">
      <h1 className="text-3xl font-bold text-amber-400 mb-6">Player Rankings</h1>
      <div className="overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Select</th>
              <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Rank</th>
              <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Player</th>
              <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Points</th>
              <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Rebuys</th>
            </tr>
          </thead>
          <tbody>
            {players
              .sort((a, b) => (playerScores[b.id]?.points || 0) - (playerScores[a.id]?.points || 0))
              .map((player, index) => (
                <tr
                  key={player.id}
                  className="hover:bg-blue-900/80 transition-colors cursor-pointer"
                  onClick={() => handlePlayerClick(player.id)}
                >
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id)}
                      onChange={() => handlePlayerSelect(player.id)}
                      className="h-4 w-4 rounded border-amber-400 text-amber-600 focus:ring-amber-500"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{index + 1}</td>
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{player.name}</td>
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                    {playerScores[player.id]?.points || 0}
                  </td>
                  <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                    {playerScores[player.id]?.rebuys || 0}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
