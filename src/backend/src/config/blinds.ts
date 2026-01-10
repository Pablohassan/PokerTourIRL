/**
 * Blinds structure - Server-side source of truth
 * This cannot be modified by the frontend
 */
export const BLINDS_STRUCTURE = [
  { level: 0, small: 10, big: 20, ante: 0 },
  { level: 1, small: 25, big: 50, ante: 0 },
  { level: 2, small: 50, big: 100, ante: 0 },
  { level: 3, small: 100, big: 200, ante: 0 },
  { level: 4, small: 150, big: 300, ante: 0 },
  { level: 5, small: 200, big: 400, ante: 10 },
  { level: 6, small: 250, big: 500, ante: 10 },
  { level: 7, small: 300, big: 600, ante: 25 },
  { level: 8, small: 400, big: 800, ante: 25 },
  { level: 9, small: 500, big: 1000, ante: 50 },
  { level: 10, small: 600, big: 1200, ante: 50 },
  { level: 11, small: 700, big: 1400, ante: 100 },
  { level: 12, small: 800, big: 1600, ante: 100 },
  { level: 13, small: 900, big: 1800, ante: 200 },
  { level: 14, small: 1000, big: 2000, ante: 200 },
  { level: 15, small: 1200, big: 2400, ante: 300 },
  { level: 16, small: 1400, big: 2800, ante: 300 },
  { level: 17, small: 1600, big: 3200, ante: 400 },
  { level: 18, small: 1800, big: 3600, ante: 400 },
  { level: 19, small: 2000, big: 4000, ante: 500 },
  { level: 20, small: 2200, big: 4400, ante: 500 },
  { level: 21, small: 2500, big: 5000, ante: 500 },
  { level: 22, small: 3000, big: 6000, ante: 1000 },
  { level: 23, small: 3500, big: 7000, ante: 1000 },
  { level: 24, small: 4000, big: 8000, ante: 2000 },
  { level: 25, small: 5000, big: 10000, ante: 2000 },
  { level: 26, small: 6000, big: 12000, ante: 3000 },
  { level: 27, small: 7000, big: 14000, ante: 3000 },
  { level: 28, small: 8000, big: 16000, ante: 4000 },
  { level: 29, small: 9000, big: 18000, ante: 4000 },
  { level: 30, small: 10000, big: 20000, ante: 5000 },
] as const;

export type BlindLevel = typeof BLINDS_STRUCTURE[number];

export const getBlindByIndex = (index: number): BlindLevel => {
  return BLINDS_STRUCTURE[Math.min(index, BLINDS_STRUCTURE.length - 1)];
};

export const getNextBlind = (currentIndex: number): BlindLevel | null => {
  const nextIndex = currentIndex + 1;
  if (nextIndex >= BLINDS_STRUCTURE.length) return null;
  return BLINDS_STRUCTURE[nextIndex];
};
