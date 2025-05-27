/**
 * Calculates player gains based on position and total number of players.
 *
 * Prize distribution rules:
 * - 6 players or less: 1st (65%), 2nd (35%)
 * - 7 players: 1st (55%), 2nd (30%), 3rd (15%)
 * - 8+ players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
 *
 * @param position Player's position (1 = winner)
 * @param totalPlayers Total number of players in the game
 * @param totalPot Total pot amount (initial buyin + rebuys)
 * @returns The gain amount for the player (can be negative if player spent more than won)
 */
export function calculateGains(position, totalPlayers, totalPot, playerCost) {
    if (!position || position > 4) {
        // Players who didn't finish in top positions lose their buy-in amount
        return -playerCost;
    }
    // Calculate percentage based on position and total players
    let percentage = 0;
    if (totalPlayers <= 6) {
        // 6 players or less: 1st (65%), 2nd (35%)
        const percentages = [0.65, 0.35, 0, 0];
        percentage = percentages[position - 1];
    }
    else if (totalPlayers === 7) {
        // 7 players: 1st (55%), 2nd (30%), 3rd (15%)
        const percentages = [0.55, 0.3, 0.15, 0];
        percentage = percentages[position - 1];
    }
    else {
        // 8 or more players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
        const percentages = [0.5, 0.28, 0.15, 0.07];
        percentage = percentages[position - 1];
    }
    // Calculate gain (prize money minus player's cost)
    const prize = totalPot * percentage;
    const gains = prize - playerCost;
    return Math.round(gains * 100) / 100; // Round to 2 decimal places
}
/**
 * Calculates the total pot based on player count and rebuys
 *
 * @param playerCount Number of players in the game
 * @param totalRebuys Total number of rebuys across all players
 * @returns Total pot amount
 */
export function calculateTotalPot(playerCount, totalRebuys) {
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
export function calculatePlayerCost(rebuys) {
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
export function calculatePartyGains(partyStats, playerId) {
    if (!partyStats || partyStats.length === 0) {
        return 0;
    }
    // Get the total number of players
    const playerCount = partyStats.length;
    // Calculate the total pot
    // Initial buy-in is 5€ per player
    const initialBuyins = playerCount * 5;
    // Calculate total rebuys (sum of all players' rebuys)
    const totalRebuys = partyStats.reduce((sum, player) => sum + (player.rebuys || 0), 0);
    // Each rebuy adds 4€ to the pot
    const rebuyAmount = totalRebuys * 4;
    // Total pot is initial buy-ins plus rebuys
    const totalPot = initialBuyins + rebuyAmount;
    // Find the player's stats
    const playerStats = partyStats.find((stat) => stat.playerId === playerId || stat.player?.id === playerId);
    if (!playerStats) {
        return 0;
    }
    // Calculate player's cost
    const playerCost = 5 + (playerStats.rebuys || 0) * 4;
    // Get the player's position
    const position = playerStats.position;
    // If player didn't finish in the money, they lose their buy-in
    if (!position || position > 4) {
        return -playerCost;
    }
    // Calculate percentage based on position and player count
    let percentage = 0;
    if (playerCount <= 6) {
        // 6 players or less: 1st (65%), 2nd (35%)
        const percentages = [0.65, 0.35, 0, 0];
        percentage = percentages[position - 1];
    }
    else if (playerCount === 7) {
        // 7 players: 1st (55%), 2nd (30%), 3rd (15%)
        const percentages = [0.55, 0.3, 0.15, 0];
        percentage = percentages[position - 1];
    }
    else {
        // 8 or more players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
        const percentages = [0.5, 0.28, 0.15, 0.07];
        percentage = percentages[position - 1];
    }
    // Calculate prize money
    const prize = totalPot * percentage;
    // Calculate gains (prize minus player's cost)
    const gains = prize - playerCost;
    return Math.round(gains * 100) / 100; // Round to 2 decimal places
}
