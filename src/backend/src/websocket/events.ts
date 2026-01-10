/**
 * WebSocket event constants
 */
export const SOCKET_EVENTS = {
  // Timer events
  TIMER_UPDATE: 'timer:update',
  TIMER_PAUSE: 'timer:pause',
  TIMER_RESUME: 'timer:resume',
  TIMER_BLIND_ADVANCE: 'timer:blindAdvance',
  
  // Game events (for future use)
  GAME_STATE_UPDATE: 'game:stateUpdate',
  PLAYER_ELIMINATED: 'game:playerEliminated',
  PLAYER_REBUY: 'game:playerRebuy',
} as const;

export type SocketEvent = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
