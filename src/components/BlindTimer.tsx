import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import alerteSon from '../assets/alarmpok.mp3';
import { motion, AnimatePresence } from "framer-motion";
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
  const nextBlindIndexRef = useRef(blindIndex);

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
      // Calculate next blind index
      const nextIndex = blindIndex + 1;

      // Check if we've reached the maximum blind level
      if (nextIndex >= blinds.length) {
        toast.error("Maximum blind level reached!");
        isUpdatingRef.current = false;
        return;
      }

      // Store the next index for use after the modal closes
      nextBlindIndexRef.current = nextIndex;

      // Show the modal with current blinds
      setPlayAlert(true);
      setShowModal(true);

      // Reset timer
      setTimeLeft(initialTimeLeft);

    } catch (error) {
      console.error('Error updating blinds:', error);
      toast.error('Failed to update blinds');
      isUpdatingRef.current = false;
    }
  }, [blindIndex, blinds.length, initialTimeLeft]);

  // Effect for time updates
  useEffect(() => {
    let timerId: number | undefined;

    const updateTimer = () => {
      if (!gameStarted || isPaused) return;

      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        if (newTime === 0) {
          updateBlinds();
          return initialTimeLeft;
        }
        return newTime;
      });
    };

    if (gameStarted && !isPaused) {
      timerId = window.setInterval(updateTimer, 1000);
    }

    return () => {
      if (timerId !== undefined) {
        window.clearInterval(timerId);
      }
    };
  }, [gameStarted, isPaused, initialTimeLeft, updateBlinds]);

  // Effect for modal auto-close and blind update
  useEffect(() => {
    if (showModal) {
      const timer = window.setTimeout(() => {
        // Update the actual blinds when the modal closes
        const { small, big, ante } = blinds[nextBlindIndexRef.current];
        onBlindChange(small, big, ante);
        setBlindIndex(nextBlindIndexRef.current);

        setShowModal(false);
        setPlayAlert(false);
        isUpdatingRef.current = false;
      }, 5000);

      return () => window.clearTimeout(timer);
    }
  }, [showModal, blinds, onBlindChange, setBlindIndex]);

  // Effect for time change notification
  useEffect(() => {
    if (timeLeft !== 0) {
      onTimeChange(timeLeft);
    }
  }, [timeLeft, onTimeChange]);

  // Get the blinds to display (current blinds in the modal)
  const displayBlinds = blinds[nextBlindIndexRef.current] || blinds[blindIndex];

  return (
    <>
      {playAlert && <audio src={alerteSon} autoPlay />}
      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className={cn(
              "bg-zinc-950/95 border-amber-500/50",
              "backdrop-blur-lg",
              "shadow-[0_0_50px_-5px_rgba(245,158,11,0.3)]",
              "max-w-[95vw] sm:max-w-[500px]",
              "p-6 sm:p-8",
              "border-2"
            )}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <DialogHeader className="mb-6">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <DialogTitle className={cn(
                      "font-['DS-DIGI']",
                      "text-4xl sm:text-5xl",
                      "text-center",
                      "text-amber-400",
                      "tracking-wider",
                      "font-bold",
                      "mb-2"
                    )}>
                      Blind Change!
                    </DialogTitle>
                    <p className="text-amber-400/80 text-center text-lg sm:text-xl font-['DS-DIGI']">
                      New blinds for next hand
                    </p>
                  </motion.div>
                </DialogHeader>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <div className="bg-zinc-900/80 rounded-xl p-4 sm:p-6 border border-amber-500/20">
                    <div className="space-y-4">
                      <motion.div
                        className="flex justify-between items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <span className="font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl">Small Blind</span>
                        <span className="font-['DS-DIGI'] text-amber-400 text-3xl sm:text-4xl">{displayBlinds.small}</span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <span className="font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl">Big Blind</span>
                        <span className="font-['DS-DIGI'] text-amber-400 text-3xl sm:text-4xl">{displayBlinds.big}</span>
                      </motion.div>

                      <div className="h-px bg-amber-400/20 my-4" />

                      <motion.div
                        className="flex justify-between items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <span className="font-['DS-DIGI'] text-amber-400/80 text-2xl sm:text-3xl">Ante</span>
                        <span className="font-['DS-DIGI'] text-amber-400 text-3xl sm:text-4xl">{displayBlinds.ante}</span>
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="text-center text-amber-400/60 text-sm sm:text-base font-['DS-DIGI']"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    Modal will close automatically in a few seconds...
                  </motion.div>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlindTimer;

