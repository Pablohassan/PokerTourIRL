// -----------------------------------------------------
// 2.2.4  UTILITY: computeTimeLeftAndBlinds
// -----------------------------------------------------
export function computeTimeLeftAndBlinds(timerState: any) {
  const { levelIndex, status, startedAt, pauseOffset } = timerState;

  const BLINDS = [
    { small: 10, big: 20, ante: 0, duration: 60 * 20 }, // 20 minutes
    { small: 25, big: 50, ante: 0, duration: 60 * 20 },
    { small: 50, big: 100, ante: 0, duration: 60 * 20 },
    { small: 100, big: 200, ante: 0, duration: 60 * 20 },
    { small: 150, big: 300, ante: 0, duration: 60 * 20 },
    { small: 200, big: 400, ante: 0, duration: 60 * 20 },
    { small: 250, big: 500, ante: 0, duration: 60 * 20 },
    { small: 300, big: 600, ante: 0, duration: 60 * 20 },
    { small: 400, big: 800, ante: 0, duration: 60 * 20 },
    { small: 500, big: 1000, ante: 0, duration: 60 * 20 },
    { small: 600, big: 1200, ante: 0, duration: 60 * 20 },
    { small: 700, big: 1400, ante: 0, duration: 60 * 20 },
    { small: 800, big: 1600, ante: 0, duration: 60 * 20 },
    { small: 900, big: 1800, ante: 0, duration: 60 * 20 },
    { small: 1000, big: 2000, ante: 0, duration: 60 * 20 },
    { small: 1200, big: 2400, ante: 0, duration: 60 * 20 },
    { small: 1500, big: 3000, ante: 0, duration: 60 * 20 },
    { small: 1600, big: 3200, ante: 0, duration: 60 * 20 },
    { small: 1800, big: 3600, ante: 0, duration: 60 * 20 },
    { small: 2000, big: 4000, ante: 0, duration: 60 * 20 },
    { small: 2000, big: 4000, ante: 0, duration: 60 * 20 },
    { small: 2500, big: 5000, ante: 0, duration: 60 * 20 },
    { small: 2500, big: 5000, ante: 0, duration: 60 * 20 },
    { small: 3000, big: 6000, ante: 0, duration: 60 * 20 },
    { small: 3000, big: 6000, ante: 0, duration: 60 * 20 },
  ];

  let timeLeft = 0;
  let currentBlinds = BLINDS[levelIndex] || null;
  let isRunning = false;

  if (status === "ended" || !currentBlinds) {
    // If ended or no blinds exist
    timeLeft = 0;
  } else if (status === "paused") {
    // paused => just use the stored offset
    timeLeft = pauseOffset;
  } else if (status === "running") {
    isRunning = true;
    const now = Date.now();
    const startedMs = startedAt ? new Date(startedAt).getTime() : 0;
    const elapsed = Math.floor((now - startedMs) / 1000); // in seconds
    timeLeft = pauseOffset - elapsed;
    if (timeLeft < 0) {
      timeLeft = 0;
    }
  }

  // Return a “front-end friendly” object
  return {
    status,
    levelIndex,
    currentBlinds,
    timeLeft, // in seconds
    isRunning,
  };
}
