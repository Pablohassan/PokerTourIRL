import React from 'react';

interface Player {
    id: number;
    name: string;
  }

interface Props {
  selectedPlayers: Player[],
}

export const SelectedPlayers: React.FC<Props> = ({ selectedPlayers }) => {
  return (
    <ul>
      {selectedPlayers.map((player) => (
        <li key={player.name}>{player.name}</li>
      ))}
    </ul>
  );
};
