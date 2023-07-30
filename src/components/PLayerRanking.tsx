import React from 'react';

interface Player {
    id: number;
    name: string;
  }

  interface Game {
    id: number;
    points: number;
    rebuys: number;
    buyin : number,
    playerId: number;
    totalCost: number;
    outAt: Date | null;
    partyId: number;
  }

interface Props {
  players: Player[],
  playerScores: Game[],
  selectedPlayers :Player[],
  handlePlayerSelect: (playerId: number) => void
}

export const PlayerRanking: React.FC<Props> = ({ players, playerScores,selectedPlayers, handlePlayerSelect }) => {
  return (
    <table>
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Name</th>
            <th>Points</th>
            <th>Rebuys</th>
            {/* add more columns as needed */}
          </tr>
        </thead>
        <tbody>
          {players.sort((a, b) => (playerScores[b.id]?.points || 0) - (playerScores[a.id]?.points || 0)).map((player, index) => (
            <tr key={player.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedPlayers.some(selectedPlayer => selectedPlayer.id === player.id)} 
                  onChange={() => handlePlayerSelect(player.id)}
                />
              </td>
              <td>{index + 1}</td>
      <td>{player.name}</td>
      <td>
        {playerScores[player.id]?.points || 0}
      </td>
      <td>
        {playerScores[player.id]?.rebuys || 0}
      </td>
    </tr>
  ))}
</tbody>
      </table>
  );
};
