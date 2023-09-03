import { Modal, ModalBody, ModalHeader } from '@nextui-org/react';
import { useState, useEffect } from 'react';
import alerteSon from '../assets/alarmpok.mp3'

interface BlindTimerProps {
    onAnteChange: (ante: number) => void;
    gameStarted: boolean;
    isPaused: boolean;
    onBlindChange: (smallBlind: number, bigBlind: number) => void;
    onTimeChange: (time: number) => void;
  }

const BlindTimer: React.FC<{
  gameStarted: boolean,
  isPaused: boolean,
  // onAnteChange: (ante: number) => void;
  onBlindChange: (smallBlind: number, bigBlind: number) => void,
  onTimeChange: (time: number) => void,
 
}> = ({ gameStarted, isPaused, onBlindChange, onTimeChange }) => {
  
  const [timeLeft, setTimeLeft] = useState(20 * 60); // Initial time in seconds
  const [blindIndex, setBlindIndex] = useState(0);
  const [playAlert, setPlayAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  

  const blinds = [
  { small: 10, big: 20, ante: 0 },
  { small: 25, big: 50, ante: 0 },
  { small: 50, big: 100, ante: 0 },
  { small: 100, big: 200, ante: 0 },
  { small: 150, big: 300, ante: 0 },
  { small: 200, big: 400, ante: 0 },
  { small: 250, big: 500, ante: 0 },
  { small: 300, big: 600, ante: 0 },
  { small: 400, big: 800, ante: 10 },
  { small: 500, big: 1000, ante: 10 },
  { small: 600, big: 1200, ante: 25 },
  { small: 700, big: 1400, ante: 25 },
  { small: 800, big: 1600, ante: 50 },
  { small: 900, big: 1800, ante: 50},
  { small: 1000, big: 2000, ante: 100}
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
            onBlindChange(blinds[newBlindIndex].small, blinds[newBlindIndex].big);
            // onAnteChange(blinds[newBlindIndex].ante);
            return 20 * 60; // reset time
        } else {
          return time - 1;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isPaused, blindIndex, onBlindChange, blinds]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setPlayAlert(false);  // Also stop the sound effect
      }, 10000); // 10 seconds
  
      return () => clearTimeout(timer); // Cleanup
    }
  }, [showModal]);

  useEffect(() => {
    onTimeChange(timeLeft);
  }, [timeLeft, onTimeChange]);
  const handleCloseModal = () => {
    setShowModal(false);
};

  
  return (
  <>
    {playAlert && <audio src={alerteSon} autoPlay />}
  
    <Modal isOpen={showModal} className="fixed inset-0 flex items-center justify-center z-50" onClick={handleCloseModal}>
    <div className="relative w-4/5 h-4/5 bg-white shadow-lg overflow-auto" onClick={(e) => e.stopPropagation()}>
      <ModalHeader>New Blind Level</ModalHeader>
      <ModalBody>
        Small: {blinds[blindIndex].small} / Big: {blinds[blindIndex].big} Ante: {blinds[blindIndex].ante}
      </ModalBody>
      </div>
    </Modal>
   
  </>
);
}


export default BlindTimer;
