import { calculatePartyGains } from "./gainsCalculator";
// Test the 29/04/2025 party scenario from the user's example
// 9 players with 4 rebuys
const testParty = [
    { playerId: 1, position: 1, rebuys: 0 }, // 1st position
    { playerId: 2, position: 2, rebuys: 0 }, // 2nd position
    { playerId: 3, position: 3, rebuys: 1 }, // 3rd position
    { playerId: 4, position: 4, rebuys: 0 }, // 4th position
    { playerId: 5, position: 5, rebuys: 1 }, // 5th position
    { playerId: 6, position: 6, rebuys: 0 }, // 6th position
    { playerId: 7, position: 7, rebuys: 0 }, // 7th position
    { playerId: 8, position: 8, rebuys: 2 }, // 8th position
    { playerId: 9, position: 9, rebuys: 0 }, // 9th position
];
// Calculate total rebuys
const totalRebuys = testParty.reduce((sum, player) => sum + player.rebuys, 0);
console.log(`Total number of rebuys: ${totalRebuys}`);
// Calculate total pot
const initialBuyins = testParty.length * 5; // 9 players * 5€ = 45€
const rebuyAmount = totalRebuys * 4; // 4 rebuys * 4€ = 16€
const totalPot = initialBuyins + rebuyAmount;
console.log(`Total pot calculation: ${testParty.length} players × 5€ = ${initialBuyins}€ initial buy-ins`);
console.log(`                      ${totalRebuys} rebuys × 4€ = ${rebuyAmount}€ rebuys`);
console.log(`                      Total pot = ${totalPot}€`);
console.log("-".repeat(60));
// Calculate and display gains for each player
console.log("Player positions and gains:");
testParty.forEach((player) => {
    const gain = calculatePartyGains(testParty, player.playerId);
    console.log(`Player ${player.playerId} (Position ${player.position}): ${gain >= 0 ? "+" : ""}${gain.toFixed(2)}€`);
});
console.log("-".repeat(60));
// Calculate prize distribution:
const winner = testParty.find((p) => p.position === 1);
const runnerUp = testParty.find((p) => p.position === 2);
const third = testParty.find((p) => p.position === 3);
const fourth = testParty.find((p) => p.position === 4);
// 8+ players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
const firstPrizePct = 0.5;
const secondPrizePct = 0.28;
const thirdPrizePct = 0.15;
const fourthPrizePct = 0.07;
console.log("Prize distribution with 9 players:");
console.log(`1st place (${firstPrizePct * 100}%): ${(totalPot * firstPrizePct).toFixed(2)}€`);
console.log(`2nd place (${secondPrizePct * 100}%): ${(totalPot * secondPrizePct).toFixed(2)}€`);
console.log(`3rd place (${thirdPrizePct * 100}%): ${(totalPot * thirdPrizePct).toFixed(2)}€`);
console.log(`4th place (${fourthPrizePct * 100}%): ${(totalPot * fourthPrizePct).toFixed(2)}€`);
// Calculate actual gains (prize minus cost)
const winnerCost = 5 + (winner?.rebuys || 0) * 4;
const runnerUpCost = 5 + (runnerUp?.rebuys || 0) * 4;
const thirdCost = 5 + (third?.rebuys || 0) * 4;
const fourthCost = 5 + (fourth?.rebuys || 0) * 4;
console.log("-".repeat(60));
console.log("Detailed gains calculation:");
console.log(`1st place: ${(totalPot * firstPrizePct).toFixed(2)}€ prize - ${winnerCost}€ cost = ${(totalPot * firstPrizePct -
    winnerCost).toFixed(2)}€ gain`);
console.log(`2nd place: ${(totalPot * secondPrizePct).toFixed(2)}€ prize - ${runnerUpCost}€ cost = ${(totalPot * secondPrizePct -
    runnerUpCost).toFixed(2)}€ gain`);
console.log(`3rd place: ${(totalPot * thirdPrizePct).toFixed(2)}€ prize - ${thirdCost}€ cost = ${(totalPot * thirdPrizePct -
    thirdCost).toFixed(2)}€ gain`);
console.log(`4th place: ${(totalPot * fourthPrizePct).toFixed(2)}€ prize - ${fourthCost}€ cost = ${(totalPot * fourthPrizePct -
    fourthCost).toFixed(2)}€ gain`);
export default function runTests() {
    // This function can be imported and called to run the tests
    return {
        testParty,
        totalPot,
        totalRebuys,
        results: testParty.map((player) => ({
            playerId: player.playerId,
            position: player.position,
            rebuys: player.rebuys,
            gain: calculatePartyGains(testParty, player.playerId),
        })),
    };
}
