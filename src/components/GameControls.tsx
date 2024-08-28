import React, { useEffect, useRef } from "react";
import BlindTimer from "./BlindTimer";
import GameTimer from "./GameTimer";

interface GameControlsProps {
  gameStarted: boolean;
  isPaused: boolean;
  timeLeft: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  handleGameEnd: () => void;
  setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
  pot: number;
  middleStack: number;
  setSmallBlind: React.Dispatch<React.SetStateAction<number>>;
  setBigBlind: React.Dispatch<React.SetStateAction<number>>;
  setAnte: React.Dispatch<React.SetStateAction<number>>;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  blindIndex: number;
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>;
  initialTimeLeft: number;
  
}

const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  isPaused,
  timeLeft,
  smallBlind,
  bigBlind,
  ante,
  handleGameEnd,
  setIsPaused,
  pot,
  middleStack,
  setSmallBlind,
  setBigBlind,
  setAnte,
  setTimeLeft,
  blindIndex,
  setBlindIndex,
  initialTimeLeft
  
}) => {
  const timerRef = useRef<number | null>(null);
  
  useEffect(() => {
  }, [initialTimeLeft]);
  useEffect(() => {
    if (!isPaused && gameStarted && timeLeft > 0) {
      timerRef.current = window.setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setSmallBlind((prev) => prev * 2);
      setBigBlind((prev) => prev * 2);
      setTimeLeft(initialTimeLeft); // Reset the timer
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPaused, gameStarted, timeLeft, setSmallBlind, setBigBlind, setTimeLeft,initialTimeLeft]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      {gameStarted && (
        <div>
          <BlindTimer
            gameStarted={gameStarted}
            isPaused={isPaused}
            onBlindChange={(small, big, ante) => {
              setSmallBlind(small);
              setBigBlind(big);
              setAnte(ante);
            } }
            onTimeChange={(time) => setTimeLeft(time)}
            blindIndex={blindIndex}
            setBlindIndex={setBlindIndex} 
            initialTimeLeft={initialTimeLeft}            
          />
          <GameTimer
            timeLeft={timeLeft}
            smallBlind={smallBlind}
            bigBlind={bigBlind}
            ante={ante}
            handleGameEnd={handleGameEnd}
            isPaused={isPaused}
            setIsPaused={setIsPaused}
            totalPot={pot}
            middleStack={middleStack}
            formatTime={formatTime}
          />
        </div>
      )}
    </div>
  );
};

export default GameControls;

