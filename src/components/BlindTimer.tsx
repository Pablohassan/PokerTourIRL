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
  // @ts-ignore - Local state needed for immediate updates while staying in sync with parent
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
  const [showModal, setShowModal] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUpdatingRef = useRef<boolean>(false);
  const nextBlindIndexRef = useRef<number>(blindIndex);
  const isInitialMount = useRef(true);
  const wakeLockRef = useRef<any>(null);

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
    { small: 2000, big: 4000, ante: 500 },
    { small: 2200, big: 4400, ante: 500 },
    { small: 2500, big: 5000, ante: 500 },
    { small: 3000, big: 6000, ante: 1000 },
    { small: 3500, big: 7000, ante: 1000 },
    { small: 4000, big: 8000, ante: 2000 },
    { small: 5000, big: 10000, ante: 2000 },
    { small: 6000, big: 12000, ante: 3000 },
    { small: 7000, big: 14000, ante: 3000 },
    { small: 8000, big: 16000, ante: 4000 },
    { small: 9000, big: 18000, ante: 4000 },
    { small: 10000, big: 20000, ante: 5000 },
  ] as const;

  // Initialize audio on component mount
  useEffect(() => {
    audioRef.current = new Audio(alerteSon);
    // Preload the audio
    audioRef.current.load();
    // Set audio properties
    audioRef.current.volume = 1.0;

    // Add click listener to document to enable audio
    const enableAudio = () => {
      if (audioRef.current) {
        // Create and immediately pause a play promise
        audioRef.current.play().then(() => {
          audioRef.current?.pause();
          audioRef.current!.currentTime = 0;
        }).catch(() => {
          // Ignore error - this is just for enabling audio
        });
      }
    };

    document.addEventListener('click', enableAudio, { once: true });

    return () => {
      document.removeEventListener('click', enableAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Effect to handle sound playing when modal shows
  useEffect(() => {
    if (showModal && audioRef.current) {
      console.log('Attempting to play sound...');
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => {
          console.log('Sound playing successfully');
        })
        .catch(error => {
          console.warn('Could not play sound:', error);
        });
    }
  }, [showModal]);

  // Initialize Screen Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && gameStarted && !isPaused) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock is active');
        }
      } catch (err) {
        console.log('Wake Lock request failed:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          console.log('Wake Lock released');
        } catch (err) {
          console.log('Wake Lock release failed:', err);
        }
      }
    };

    // Request wake lock when game starts
    if (gameStarted && !isPaused) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Re-request wake lock on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && gameStarted && !isPaused) {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock();
    };
  }, [gameStarted, isPaused]);

  const updateBlinds = useCallback(() => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    try {
      const currentIndex = blindIndex;
      const nextIndex = currentIndex + 1;
      console.log('Updating blinds:', { currentIndex, nextIndex });

      if (nextIndex >= blinds.length) {
        toast.error("Maximum blind level reached!");
        isUpdatingRef.current = false;
        return;
      }

      const { small, big, ante } = blinds[nextIndex];
      console.log('New blind values:', { small, big, ante });

      onBlindChange(small, big, ante);
      setBlindIndex(nextIndex);
      nextBlindIndexRef.current = nextIndex;

      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
        isUpdatingRef.current = false;
      }, 8000);

    } catch (error) {
      console.error('Error updating blinds:', error);
      toast.error('Failed to update blinds');
      isUpdatingRef.current = false;
    }
  }, [blindIndex, blinds.length, onBlindChange, setBlindIndex]);

  // Effect to sync nextBlindIndexRef with blindIndex
  useEffect(() => {
    nextBlindIndexRef.current = blindIndex;
  }, [blindIndex]);

  // Effect to sync timeLeft with initialTimeLeft
  useEffect(() => {
    setTimeLeft(initialTimeLeft);
  }, [initialTimeLeft]);

  // Effect for time updates
  useEffect(() => {
    console.log('Timer effect running:', { gameStarted, isPaused });
    let timerId: NodeJS.Timeout | null = null;

    const startTimer = () => {
      console.log('Starting timer');
      if (timerId) {
        console.log('Timer already running');
        return;
      }

      timerId = setInterval(() => {
        setTimeLeft(prevTime => {
          console.log('Current time:', prevTime);
          const newTime = prevTime - 1;
          if (newTime === 0) {
            updateBlinds();
          }
          if (newTime < 0) {
            return initialTimeLeft;
          }
          return newTime;
        });
      }, 1000);
    };

    const stopTimer = () => {
      if (timerId) {
        console.log('Stopping timer');
        clearInterval(timerId);
        timerId = null;
      }
    };

    if (gameStarted && !isPaused) {
      startTimer();
    } else {
      stopTimer();
    }

    return () => {
      stopTimer();
    };
  }, [gameStarted, isPaused, initialTimeLeft]);

  // Effect to handle sound and modal on game state restoration
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // If we're restoring state and timeLeft is 0, trigger sound and modal
    if (gameStarted && timeLeft === 0 && !isUpdatingRef.current) {
      setShowModal(true);
    }
  }, [gameStarted, timeLeft]);

  // Notify parent of time changes
  useEffect(() => {
    if (typeof timeLeft === 'number' && !isNaN(timeLeft)) {
      onTimeChange(timeLeft);
    }
  }, [timeLeft, onTimeChange]);

  // Get the current blinds to display
  const displayBlinds = blinds[nextBlindIndexRef.current] || blinds[blindIndex];

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <Dialog open={showModal} onOpenChange={setShowModal} >
            <DialogContent className={cn(
              "bg-zinc-950/95 border-amber-500/50",
              "backdrop-blur-lg",
              "shadow-[0_0_50px_-5px_rgba(245,158,11,0.3)]",
              "max-w-[95vw] sm:max-w-[700px]",
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
                      "font-ds-digital",
                      "text-4xl sm:text-5xl",
                      "text-center",
                      "text-amber-400",
                      "tracking-wider",
                      "font-bold",
                      "mb-2"
                    )}>
                      Blind Change!
                    </DialogTitle>
                    <p className="text-amber-400/80 text-center text-lg sm:text-xl font-ds-digital">
                      Changement de blind a la prochaine main
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
                        <span className="font-ds-digital text-amber-400/80 text-2xl sm:text-3xl">Small Blind</span>
                        <span className="font-ds-digital text-amber-400 text-3xl sm:text-4xl">{displayBlinds.small}</span>
                      </motion.div>

                      <motion.div
                        className="flex justify-between items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <span className="font-ds-digital text-amber-400/80 text-2xl sm:text-3xl">Big Blind</span>
                        <span className="font-ds-digital text-amber-400 text-3xl sm:text-4xl">{displayBlinds.big}</span>
                      </motion.div>

                      <div className="h-px bg-amber-400/20 my-4" />

                      <motion.div
                        className="flex justify-between items-center"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <span className="font-ds-digital text-amber-400/80 text-2xl sm:text-3xl">Ante</span>
                        <span className="font-ds-digital text-amber-400 text-3xl sm:text-4xl">{displayBlinds.ante}</span>
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    className="text-center text-amber-400/60 text-sm sm:text-base font-ds-digital"
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

