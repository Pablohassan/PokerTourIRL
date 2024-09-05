import React, { useEffect} from 'react';
import { Button } from '@nextui-org/react'; // Replace with the actual path to your Button component

interface GameTimerProps {
  formatTime: (time: number) => string;
  totalPot: number;
  middleStack: number;
  timeLeft: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  handleGameEnd: () => void;
  isPaused: boolean;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameTimer: React.FC<GameTimerProps> = ({
  middleStack,
  totalPot,
  formatTime,
  timeLeft,
  smallBlind,
  bigBlind,
  handleGameEnd,
  isPaused,
  setIsPaused,
  ante
}) => {

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space') { // Using 'code' is more reliable than 'keyCode'
      event.preventDefault(); // Prevent the default spacebar action
      event.stopPropagation();

      const target = event.target as HTMLElement;
      if (!['INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        setIsPaused(!isPaused);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: '1fr auto',
      height: '350px',
      width: '970px',
      border: '4px solid black',
      borderRadius: '16px',
      background: 'rgba(0, 0, 0, 0.2)',
      boxShadow: '0px 4px 6px rgba(0, 0,5, 0, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '2px solid #D1D5DB',
      }}>
        <div style={{
          fontFamily: "DS-DIGI",
          alignItems: "center",
          fontSize: '2.5em',
          height: "75%",
          width: "40%",
          padding: '10px',
          margin: '10px',
          border: "4px solid black",
          borderRadius: '12px',
          background: '#100D14',
          color: 'white',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
        }}>
          Time left:
          <div style={{ fontSize: "3.5em", alignItems: "center", padding: '2px' }}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <div style={{
          fontFamily: "DS-DIGI",
          height: '75%',
          fontSize: '3em',
          padding: '10px',
          width: '30%',
          borderRadius: '12px',
          background: '#100D14',
          margin: '10px',
          color: 'white',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
        }}>
          Small: {smallBlind}
          <div>Big: {bigBlind}</div>
          <div style={{ background: "white", width: "100%", height: "2px", margin: "5px" }}></div>
          <div style={{ marginTop: '8px' }}>Ante: {ante}</div>
        </div>
        <div style={{
          fontFamily: "DS-DIGI",
          height: '75%',
          fontSize: '2.5em',
          padding: '20px',
          width: '30%',
          borderRadius: '12px',
          background: '#100D14',
          margin: '10px',
          color: 'white',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
        }}>
          <div>Pot: {totalPot}</div>
          <div>M-Stack: {middleStack}</div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'rgba(0, 0, 0, 0.5)',
        borderTop: '2px solid #D1D5DB',
        borderRadius: '0 0 16px 16px'
      }}>
        <Button color="danger" size='lg' className="text-white" onClick={handleGameEnd}>
          <div style={{ fontSize: "20px" }}>Stop Partie</div>
        </Button>
        <Button color="warning" size='lg' className="text-black" onClick={() => setIsPaused(!isPaused)}>
          <div style={{ fontSize: "20px" }}>
            {isPaused ? 'Resume' : 'Pause'}
          </div>
        </Button>
      </div>
    </div>
  );
};

export default React.memo(GameTimer);

