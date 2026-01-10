import prisma from '../lib/prisma.js';
import { getBlindByIndex, getNextBlind } from '../config/blinds.js';

export interface TimerState {
  timeLeft: number;
  blindIndex: number;
  small: number;
  big: number;
  ante: number;
  isPaused: boolean;
  nextBlind: { small: number; big: number; ante: number } | null;
  blindLevelStartedAt: number | null;
  pausedTimeRemaining: number | null;
}

/**
 * Computes the current timer state from the database.
 * Time is calculated server-side based on blindLevelStartedAt timestamp.
 */
export const getComputedTimer = async (): Promise<TimerState | null> => {
  const gameState = await prisma.gameState.findFirst();
  
  if (!gameState) {
    return null;
  }

  // Parse the JSON state for backward compatibility
  const state = gameState.state as any;
  console.log('[TimerDebug] DB State:', { 
    id: gameState.id, 
    blindLevelStartedAt: state.blindLevelStartedAt, 
    lastSavedTime: state.lastSavedTime,
    isPaused: state.isPaused, 
    pausedTimeRemaining: state.pausedTimeRemaining,
    timeLeftInDb: state.timeLeft
  });
  
  // Use new fields if available, fallback to JSON state
  const blindIndex = state.blindIndex ?? 0;
  const blindDurationSeconds = (state.currentBlindDuration ?? 15) * 60;
  const isPaused = state.isPaused ?? false;
  const pausedTimeRemaining = state.pausedTimeRemaining ?? null;
  const blindLevelStartedAt = state.blindLevelStartedAt;

  const currentBlind = getBlindByIndex(blindIndex);
  const nextBlind = getNextBlind(blindIndex);
  let timeLeftSeconds: number;

  if (isPaused && pausedTimeRemaining !== null) {
    // If paused, use saved remaining time
    timeLeftSeconds = pausedTimeRemaining;
  } else if (state.blindLevelStartedAt) {
    // Prefer absolute timing if we have a level start timestamp
    const startedAt = new Date(state.blindLevelStartedAt).getTime();
    const elapsed = (Date.now() - startedAt) / 1000;
    timeLeftSeconds = Math.max(0, blindDurationSeconds - elapsed);
    console.log('[TimerDebug] Absolute calc:', { startedAt, elapsed, blindDurationSeconds, timeLeftSeconds });
  } else {
    // Fallback to relative timing from last saved state
    const lastSaved = state.lastSavedTime ? new Date(state.lastSavedTime).getTime() : Date.now();
    const elapsed = (Date.now() - lastSaved) / 1000;
    const baseTimeLeft = typeof state.timeLeft === 'number' ? state.timeLeft : blindDurationSeconds;
    timeLeftSeconds = Math.max(0, baseTimeLeft - elapsed);
    console.log('[TimerDebug] Relative calc:', { lastSaved, elapsed, baseTimeLeft, timeLeftSeconds });
  }

  return {
    timeLeft: Math.floor(timeLeftSeconds),
    blindIndex,
    small: currentBlind.small,
    big: currentBlind.big,
    ante: currentBlind.ante,
    isPaused,
    nextBlind: nextBlind ? { small: nextBlind.small, big: nextBlind.big, ante: nextBlind.ante } : null,
    blindLevelStartedAt,
    pausedTimeRemaining,
  };
};

/**
 * Check if blind level should advance and update if needed.
 * Returns true if level was advanced.
 */
export const checkAndAdvanceBlind = async (): Promise<boolean> => {
  const timerState = await getComputedTimer();
  if (!timerState || timerState.isPaused) return false;

  if (timerState.timeLeft <= 0 && timerState.nextBlind) {
    const gameState = await prisma.gameState.findFirst();
    if (!gameState) return false;

    const state = gameState.state as any;
    const newBlindIndex = (state.blindIndex ?? 0) + 1;
    const newBlind = getBlindByIndex(newBlindIndex);

    // Update state in JSON (backward compatible)
    const updatedState = {
      ...state,
      blindIndex: newBlindIndex,
      blindLevelStartedAt: Date.now(),
      smallBlind: newBlind.small,
      bigBlind: newBlind.big,
      ante: newBlind.ante,
    };

    await prisma.gameState.update({
      where: { id: gameState.id },
      data: { state: updatedState },
    });

    return true;
  }

  return false;
};

/**
 * Pause the timer
 */
export const pauseTimer = async (): Promise<void> => {
  const timerState = await getComputedTimer();
  if (!timerState || timerState.isPaused) return;

  const gameState = await prisma.gameState.findFirst();
  if (!gameState) return;

  const state = gameState.state as any;
  const updatedState = {
    ...state,
    isPaused: true,
    pausedTimeRemaining: timerState.timeLeft,
  };

  await prisma.gameState.update({
    where: { id: gameState.id },
    data: { state: updatedState },
  });
};

/**
 * Resume the timer
 */
export const resumeTimer = async (): Promise<void> => {
  const gameState = await prisma.gameState.findFirst();
  if (!gameState) return;

  const state = gameState.state as any;
  if (!state.isPaused) return;

  const blindDurationSeconds = (state.currentBlindDuration ?? 15) * 60;
  const remainingTime = state.pausedTimeRemaining ?? blindDurationSeconds;
  
  // Calculate new start time so that elapsed time gives us the remaining time
  const newStartTime = Date.now() - ((blindDurationSeconds - remainingTime) * 1000);

  const updatedState = {
    ...state,
    isPaused: false,
    pausedTimeRemaining: null,
    blindLevelStartedAt: newStartTime,
  };

  await prisma.gameState.update({
    where: { id: gameState.id },
    data: { state: updatedState },
  });
};
