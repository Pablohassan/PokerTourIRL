import React from 'react';
import { Player } from './interfaces';
import { Button } from '@nextui-org/react';

interface ReviewSelectedPlayersProps {
  selectedPlayers: Player[];
  onConfirm: () => void;
}

const ReviewSelectedPlayers: React.FC<ReviewSelectedPlayersProps> = ({ selectedPlayers,onConfirm}) => {
  return (
    <div style={{width:"800px",height:"400px", border:"solid" }}>
      <h3 style={{color:"red"}}>Review Selected Players</h3>
      <ul> 
        {selectedPlayers.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <Button onClick={onConfirm}>Confirm and Start Game</Button>
    </div>
  );
}

export default ReviewSelectedPlayers;