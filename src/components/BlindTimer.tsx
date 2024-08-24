import { Modal, ModalBody, ModalHeader } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import alerteSon from '../assets/alarmpok.mp3'

interface BlindTimerProps {
  gameStarted: boolean;
  isPaused: boolean;
  onBlindChange: (smallBlind: number, bigBlind: number, ante: number) => void;
  onTimeChange: (time: number) => void;
  blindIndex: number;
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>;
  initialTimeLeft: number;
}

const BlindTimer: React.FC<BlindTimerProps> = ({ gameStarted, isPaused, onBlindChange, onTimeChange, blindIndex, setBlindIndex, initialTimeLeft }) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft); 
  const [playAlert, setPlayAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

  ];


  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (isPaused) {
          return time;
        }
        if (time === 0) {
          setPlayAlert(true);
          setShowModal(true);

          let newBlindIndex = blindIndex;
          if (blindIndex < blinds.length - 1) {
            newBlindIndex = blindIndex + 1;
            setBlindIndex(newBlindIndex);
          }
          onBlindChange(blinds[newBlindIndex].small, blinds[newBlindIndex].big, blinds[newBlindIndex].ante);
          return initialTimeLeft;; // reset time
        } else {
          return Math.floor(time - 1)
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isPaused, blindIndex, onBlindChange, blinds, setBlindIndex,initialTimeLeft]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setPlayAlert(false);  
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [showModal]);

  useEffect(() => {
    if (timeLeft !== 0) {
        onTimeChange(timeLeft);
    }
}, [timeLeft, onTimeChange]);



  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const formatTime = (time: number): string => {
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  // };

  return (
    <>
      {playAlert && <audio src={alerteSon} autoPlay />}
      <Modal isOpen={showModal} className="fixed min-w-fit inset-0 flex items-center justify-center z-50" onClick={handleCloseModal}>
        <div className="relative w-4/5 h-4/5 bg-white shadow-lg overflow-auto rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
          <ModalHeader className="text-center text-lg font-bold">
            New Blind Level
          </ModalHeader>
          <ModalBody className="text-center text-base">
            Small: {blinds[blindIndex].small} / Big: {blinds[blindIndex].big} Ante: {blinds[blindIndex].ante}
          </ModalBody>
        </div>
      </Modal>
    </>
  );
}

export default BlindTimer;

