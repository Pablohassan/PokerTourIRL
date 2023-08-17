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
      
     
      
    </ul>
  );
};
