import { Server as SocketServer } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { handleTimerEvents } from './handlers/timer.handler.js';
import { getComputedTimer, checkAndAdvanceBlind } from '../services/timer.service.js';
import { SOCKET_EVENTS } from './events.js';

let io: SocketServer | null = null;
let timerInterval: NodeJS.Timeout | null = null;

/**
 * Initialize WebSocket server
 */
export const initializeWebSocket = (httpServer: HttpServer, corsOrigin: string): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('WebSocket client connected:', socket.id);
    
    // Setup timer event handlers
    handleTimerEvents(io!, socket);
    
    // Send current timer state on connect
    getComputedTimer().then((timerState) => {
      if (timerState) {
        socket.emit(SOCKET_EVENTS.TIMER_UPDATE, timerState);
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket client disconnected:', socket.id);
    });
  });

  // Start broadcasting timer updates every second
  startTimerBroadcast();

  console.log('WebSocket server initialized');
  return io;
};

/**
 * Broadcast timer state to all connected clients every second
 */
const startTimerBroadcast = (): void => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(async () => {
    if (!io) return;

    try {
      // Check if blind should advance
      const advanced = await checkAndAdvanceBlind();
      if (advanced) {
        io.emit(SOCKET_EVENTS.TIMER_BLIND_ADVANCE, { message: 'Blind level advanced' });
      }

      // Get current timer state
      const timerState = await getComputedTimer();
      if (timerState) {
        io.emit(SOCKET_EVENTS.TIMER_UPDATE, timerState);
      }
    } catch (error) {
      console.error('Error broadcasting timer:', error);
    }
  }, 1000);
};

/**
 * Stop timer broadcast (cleanup)
 */
export const stopTimerBroadcast = (): void => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

/**
 * Get the Socket.io instance
 */
export const getIO = (): SocketServer | null => io;
