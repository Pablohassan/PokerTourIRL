/**
 * Calculates player gains based on position and total number of players.
 *
 * Prize distribution rules (based on paid positions):
 * - 2 paid: 1st (65%), 2nd (35%)
 * - 3 paid: 1st (55%), 2nd (30%), 3rd (15%)
 * - 4 paid: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
 *
 * @param position Player's position (1 = winner)
 * @param totalPlayers Total number of players in the game
 * @param totalPot Total pot amount (initial buyin + rebuys)
 * @param playerCost Total cost for the player (buy-in + rebuys)
 * @param totalRebuys Total rebuys across the party (used for paid positions)
 * @returns The gain amount for the player (can be negative if player spent more than won)
 */
export function calculateGains(
 position: number,
  totalPlayers: number,
  totalPot: number,
  playerCost: number,
  totalRebuys = 0
): number {
  const payingPositions = getPayingPositions(totalPlayers, totalRebuys);
  const paidCount = payingPositions.length;

  if (!position || position > paidCount) {
    return -playerCost;
  }

  const percentagesByPaidCount: Record<number, number[]> = {
    2: [0.65, 0.35],
    3: [0.55, 0.3, 0.15],
    4: [0.5, 0.28, 0.15, 0.07],
  };

  const percentages = percentagesByPaidCount[paidCount] || [];
  const percentage = percentages[position - 1] ?? 0;

  // Calculate gain (prize money minus player's cost)
  const prize = totalPot * percentage;
  const gains = prize - playerCost;

  return Math.round(gains * 100) / 100; // Round to 2 decimal places
}

export function getPayingPositions(
  totalPlayers: number,
  totalRebuys = 0
): number[] {
  if (totalPlayers <= 0) return [];

  let paidCount = 0;

  if (totalPlayers <= 6) {
    paidCount = 2;
  } else if (totalPlayers === 7) {
    paidCount = 3;
  } else if (totalPlayers === 8) {
    paidCount = 3;
  } else {
    paidCount = 4;
  }

  if ((totalPlayers === 6 || totalPlayers === 8) && totalRebuys >= totalPlayers) {
    paidCount += 1;
  }

  paidCount = Math.min(paidCount, totalPlayers);

  const positions: number[] = [];
  for (let i = 1; i <= paidCount; i += 1) {
    positions.push(i);
  }

  return positions;
}

export function getPaidCount(totalPlayers: number, totalRebuys = 0): number {
  return getPayingPositions(totalPlayers, totalRebuys).length;
}

export function getBubblePosition(
  totalPlayers: number,
  totalRebuys = 0
): number | null {
  const paidCount = getPaidCount(totalPlayers, totalRebuys);
  return paidCount > 0 ? paidCount + 1 : null;
}

/**
 * Calculates the total pot based on player count and rebuys
 *
 * @param playerCount Number of players in the game
 * @param totalRebuys Total number of rebuys across all players
 * @returns Total pot amount
 */
export function calculateTotalPot(
  playerCount: number,
  totalRebuys: number
): number {
  // Initial buy-in is 5€ per player
  const initialBuyins = playerCount * 5;

  // Each rebuy adds 4€ to the pot
  const rebuyAmount = totalRebuys * 4;

  return initialBuyins + rebuyAmount;
}

/**
 * Calculates player cost (initial buy-in + rebuys)
 *
 * @param rebuys Number of rebuys for this player
 * @returns Total cost for this player
 */
export function calculatePlayerCost(rebuys: number): number {
  // Initial buy-in is 5€
  const initialBuyin = 5;

  // Each rebuy costs 4€
  const rebuyAmount = rebuys * 4;

  return initialBuyin + rebuyAmount;
}

/**
 * Calculate gains for a specific party based on all players' stats
 *
 * This function ensures the total pot is calculated correctly with all players' rebuys
 * and distributes prizes according to the correct percentages based on position.
 *
 * @param partyStats Stats for all players in a party
 * @param playerId ID of the player to calculate gains for
 * @returns The calculated gains (winnings minus costs) for the specified player
 */
export function calculatePartyGains(
  partyStats: any[],
  playerId: number
): number {
  if (!partyStats || partyStats.length === 0) {
    return 0;
  }

  // Get the total number of players
  const playerCount = partyStats.length;

  // Calculate the total pot
  // Initial buy-in is 5€ per player
  const initialBuyins = playerCount * 5;

  // Calculate total rebuys (sum of all players' rebuys)
  const totalRebuys = partyStats.reduce(
    (sum, player) => sum + (player.rebuys || 0),
    0
  );

  // Each rebuy adds 4€ to the pot
  const rebuyAmount = totalRebuys * 4;

  // Total pot is initial buy-ins plus rebuys
  const totalPot = initialBuyins + rebuyAmount;

  // Find the player's stats
  const playerStats = partyStats.find(
    (stat) => stat.playerId === playerId || stat.player?.id === playerId
  );

  if (!playerStats) {
    return 0;
  }

  // Calculate player's cost
  const playerCost = 5 + (playerStats.rebuys || 0) * 4;

  // Get the player's position
  const position = playerStats.position;

  return calculateGains(position, playerCount, totalPot, playerCost, totalRebuys);
}
