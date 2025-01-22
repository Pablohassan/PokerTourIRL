import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import alerteSon from '../assets/alarmpok.mp3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "../lib/utils";

interface BlindTimerProps {
  gameStarted: boolean;
  isPaused: boolean;
  onBlindChange: (smallBlind: number, bigBlind: number, ante: number) => void;
  onTimeChange: (time: number) => void;
  blindIndex: number;
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>;
  initialTimeLeft: number;
}

const BlindTimer: React.FC<BlindTimerProps> = ({
  gameStarted,
  isPaused,
  onBlindChange,
  onTimeChange,
  blindIndex,
  setBlindIndex,
  initialTimeLeft
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [playAlert, setPlayAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isUpdatingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const updateBlinds = useCallback(() => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    try {
      let newBlindIndex = blindIndex;
      if (blindIndex < blinds.length - 1) {
        newBlindIndex = blindIndex + 1;
        setBlindIndex(newBlindIndex);
      }

      const { small, big, ante } = blinds[newBlindIndex];
      onBlindChange(small, big, ante);
      setTimeLeft(initialTimeLeft);
      setPlayAlert(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error updating blinds:', error);
      toast.error('Failed to update blinds');
    } finally {
      isUpdatingRef.current = false;
    }
  }, [blindIndex, blinds, initialTimeLeft, onBlindChange, setBlindIndex]);

  useEffect(() => {
    if (!gameStarted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((time) => {
        if (isPaused) {
          return time;
        }

        if (time === 0) {
          updateBlinds();
          return initialTimeLeft;
        }

        return Math.floor(time - 1);
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameStarted, isPaused, updateBlinds, initialTimeLeft]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setPlayAlert(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showModal]);

  useEffect(() => {
    if (timeLeft !== 0) {
      onTimeChange(timeLeft);
    }
  }, [timeLeft, onTimeChange]);

  return (
    <>
      {playAlert && <audio src={alerteSon} autoPlay />}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className={cn(
          "bg-slate-900/95 border-amber-400/20",
          "backdrop-blur-md",
          "shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]",
          "max-w-[90vw] sm:max-w-[400px]",
          "p-3 sm:p-4"
        )}>
          <DialogHeader>
            <DialogTitle className={cn(
              "font-['DS-DIGI'] text-2xl sm:text-3xl text-center",
              "text-amber-400",
              "tracking-wider"
            )}>
              New Blind Level
            </DialogTitle>
          </DialogHeader>
          <div className="font-['DS-DIGI'] text-xl sm:text-2xl text-center space-y-2 py-2 sm:py-4">
            <div className="flex justify-between px-4 sm:px-8">
              <span className="text-amber-400/80">Small Blind</span>
              <span className="text-amber-400">{blinds[blindIndex].small}</span>
            </div>
            <div className="flex justify-between px-4 sm:px-8">
              <span className="text-amber-400/80">Big Blind</span>
              <span className="text-amber-400">{blinds[blindIndex].big}</span>
            </div>
            <div className="h-px bg-amber-400/20 mx-4 sm:mx-8 my-2 sm:my-4" />
            <div className="flex justify-between px-4 sm:px-8">
              <span className="text-amber-400/80">Ante</span>
              <span className="text-amber-400">{blinds[blindIndex].ante}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default BlindTimer;

