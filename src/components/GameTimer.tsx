import React, { useState } from 'react';
import {Button} from '@nextui-org/react'; // Replace with the actual path to your Button component

interface GameTimerProps {
  formatTime: (time: number) => string;
  timeLeft: number;
  smallBlind: number;
  bigBlind: number;
  handleGameEnd: () => void;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameTimer: React.FC<GameTimerProps> = ({
  formatTime,
  timeLeft,
  smallBlind,
  bigBlind,
  handleGameEnd,
  isPaused,
  setIsPaused,
}) => {

 
  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr 1fr', height: '250px', width:"600px", border: '4px solid #D1D5DB', borderRadius: '8px' }}>
      {/* Timer and Blinds */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150px', borderBottom: '2px solid #D1D5DB', color: 'white'}}>
        {/* Timer */}
        <div style={{ fontSize: '32px', background: '#1E3A8A', padding: '16px', borderRadius: '10px', fontFamily:"DS-DIGI" }}>
          Time left: {formatTime(timeLeft)}
        </div>
    
        <div style={{ fontSize: '24px', background: 'black', marginLeft: '16px', padding: '16px', borderRadius: '10px', color: 'white' }}>
          Small: {smallBlind} / Big: {bigBlind}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', height: '50%' }}>
        <div style={{ padding: '10px' }}>
          <Button color="danger" className="text-white" onClick={handleGameEnd}>
            Stop Partie
          </Button>
        </div>
        <div style={{ padding: '10px' }}>
          <Button
            className="text-white"
            color="warning"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameTimer);
