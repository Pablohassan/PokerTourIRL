import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import nextBlindVideo from '../assets/pinup.mp4';
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,

} from "./ui/dialog";
import { Player } from "./interfaces";




const FADE = 0.5; // 500 ms
const TOTAL = 6;  // durée totale du splash (fade‑in + lecture + fade‑out)

interface NextBlindSplashProps {
  show: boolean;
  onClose: () => void;
  blinds: { small: number; big: number; ante: number };
  outPlayers: Player[];
  showOutPlayers: boolean;
  videoSrc: string;
}

const NextBlindSplash: React.FC<NextBlindSplashProps> = ({
  show,
  onClose,
  blinds,
  outPlayers,
  showOutPlayers,
  videoSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /* auto‑fermeture après TOTAL secondes ------------------------------ */
  useEffect(() => {
    if (!show) return;
    const id = setTimeout(onClose, TOTAL * 1000);
    return () => clearTimeout(id);
  }, [show, onClose]);

  // Relance la vidéo avec le son à chaque ouverture
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (!show) {
      videoEl.pause();
      videoEl.currentTime = 0;
      return;
    }

    videoEl.muted = false;
    videoEl.currentTime = 0;
    videoEl.play().catch((err) => {
      console.warn('Impossible de lancer la vidéo avec le son :', err);
    });
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <Dialog open={show} onOpenChange={onClose}>
          {/* ↓↓↓  on pousse la modale un peu plus haut */}
          <DialogContent
            className="max-w-full sm:max-w-[800px] p-0 overflow-hidden bg-transparent border-none shadow-none sm:top-8 sm:translate-y-0"
          >
            <DialogTitle className="sr-only">Niveau de Blind Suivant</DialogTitle>
            {/* Vidéo rétro */}
            <motion.video
              key="arcade-video"
              src={videoSrc}
              autoPlay
              playsInline
              ref={videoRef}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: FADE, ease: "easeOut" }}
              /* ↓↓↓  ancre la vidéo en haut du cadre */
              className="border-2 border-amber-400/70 w-full h-full object-cover object-top"
            />

            {/* Overlay valeurs */}
            <motion.div
              aria-live="polite"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: FADE / 2, duration: FADE / 2 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
            >
              {[
                { label: "Small Blind", value: blinds.small, delay: 0.3 },
                { label: "Big Blind", value: blinds.big, delay: 0.4 },
                { label: "Ante", value: blinds.ante, delay: 0.5 },
              ].map(({ label, value, delay }) => (
                <motion.div
                  key={label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ delay: delay + FADE, duration: 0.4 }}
                  className="relative flex w-full max-w-xs justify-between font-ds-digital text-amber-300 drop-shadow-[0_0_6px_#f59e0b] tracking-wider text-3xl sm:text-4xl"
                >
                  <span className="font-bold" style={{ transform: "translateX(-100px)" }}>{label}</span>
                  <span className="font-bold" style={{ transform: "translateX(80px)" }}>{value}</span>

                  {/* Liste joueurs éliminés — sous Ante */}
                  {label === "Ante" && showOutPlayers && outPlayers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-zinc-900/90 rounded-lg shadow-xl border border-amber-500/20"
                    >
                      <div className="p-2 max-h-40 overflow-y-auto">
                        <h4 className="font-ds-digital text-amber-400 text-sm mb-1">
                          Eliminated Players:
                        </h4>
                        {outPlayers.map((p) => (
                          <div
                            key={p.id}
                            className="text-amber-400/80 font-ds-digital text-xs py-1 border-b border-amber-500/10"
                          >
                            {p.name}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};


interface BlindTimerProps {
  gameStarted: boolean;
  isPaused: boolean;
  onBlindChange: (smallBlind: number, bigBlind: number, ante: number) => void;
  onTimeChange: (time: number) => void;
  blindIndex: number;
  setBlindIndex: React.Dispatch<React.SetStateAction<number>>;
  initialTimeLeft: number;
  outPlayers: Player[];
  socketConnected?: boolean;
  serverNextBlind?: { small: number; big: number; ante: number } | null;
}

const BlindTimer: React.FC<BlindTimerProps> = ({
  gameStarted,
  isPaused,
  onBlindChange,
  onTimeChange,
  blindIndex,
  setBlindIndex,
  initialTimeLeft,
  outPlayers,
  socketConnected = false,
  serverNextBlind = null,
}) => {
  // @ts-ignore - Local state needed for immediate updates while staying in sync with parent
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeLeft);
  const [showModal, setShowModal] = useState<boolean>(false);
  const isUpdatingRef = useRef<boolean>(false);
  const nextBlindIndexRef = useRef<number>(blindIndex);
  const isInitialMount = useRef(true);
  const wakeLockRef = useRef<any>(null);
  const [showOutPlayers, setShowOutPlayers] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

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
      }, 9000);

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

      // Skip local countdown if WebSocket is handling the timer
      if (socketConnected) {
        console.log('WebSocket is connected, skipping local countdown interval');
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
  }, [gameStarted, isPaused, initialTimeLeft, socketConnected]);

  // Effect to trigger splash screen when server advances blind level
  useEffect(() => {
    if (socketConnected && gameStarted && !isInitialMount.current) {
      // If blindIndex increased, it means the server advanced the level
      if (blindIndex > 0) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 9000);
      }
    }
  }, [blindIndex, socketConnected, gameStarted]);

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

  // Notify parent of time changes - DEBOUNCED or REMOVED to prevent loop
  // The parent likely tracks time via useGameState, so this might be redundant or causing the loop.
  // We'll remove the immediate callback.
  /*
  useEffect(() => {
    if (typeof timeLeft === 'number' && !isNaN(timeLeft)) {
      onTimeChange(timeLeft);
    }
  }, [timeLeft, onTimeChange]);
  */


  // Add this useEffect for the automated dropdown
  useEffect(() => {
    if (showModal) {
      intervalRef.current = setInterval(() => {
        setShowOutPlayers(prev => !prev);
      }, 30000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showModal]);

  // Get the current blinds to display
  // Favors server data if available, otherwise falls back to local array
  const displayBlinds = serverNextBlind || blinds[nextBlindIndexRef.current] || blinds[blindIndex];

  return (
    <> <NextBlindSplash
      show={showModal}
      onClose={() => setShowModal(false)}
      blinds={displayBlinds}
      outPlayers={outPlayers}
      showOutPlayers={showOutPlayers}
      videoSrc={nextBlindVideo}
    />
    </>
  );
};

export default BlindTimer;
