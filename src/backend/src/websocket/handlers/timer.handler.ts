import type { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '../events.js';
import { getComputedTimer, pauseTimer, resumeTimer } from '../../services/timer.service.js';

/**
 * Handle timer-related WebSocket events
 */
export const handleTimerEvents = (io: Server, socket: Socket): void => {
  // Client requests current timer state
  socket.on('timer:get', async () => {
    const timerState = await getComputedTimer();
    if (timerState) {
      socket.emit(SOCKET_EVENTS.TIMER_UPDATE, timerState);
    }
  });

  // Client requests to pause timer
  socket.on(SOCKET_EVENTS.TIMER_PAUSE, async () => {
    await pauseTimer();
    const timerState = await getComputedTimer();
    if (timerState) {
      io.emit(SOCKET_EVENTS.TIMER_UPDATE, timerState);
    }
  });

  // Client requests to resume timer
  socket.on(SOCKET_EVENTS.TIMER_RESUME, async () => {
    await resumeTimer();
    const timerState = await getComputedTimer();
    if (timerState) {
      io.emit(SOCKET_EVENTS.TIMER_UPDATE, timerState);
    }
  });
};
