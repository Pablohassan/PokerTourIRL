import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
export const PlayerPage = () => {
    const { playerId } = useParams();
    const [playerStats, setPlayerStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2025);
    const years = [2023, 2024, 2025];
    /**
     * Calculates player gains based on position and total number of players.
     *
     * Prize distribution rules:
     * - 6 players or less: 1st (65%), 2nd (35%)
     * - 7 players: 1st (55%), 2nd (30%), 3rd (15%)
     * - 8+ players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
     */
    function calculateGains(stats) {
        if (!playerId)
            return 0;
        // Group stats by party
        const statsByParty = {};
        stats.forEach(stat => {
            if (!statsByParty[stat.partyId]) {
                statsByParty[stat.partyId] = [];
            }
            statsByParty[stat.partyId].push(stat);
        });
        // Calculate total gains across all parties
        let totalGains = 0;
        Object.values(statsByParty).forEach(partyStats => {
            // Get all players in this party to determine player count
            const partyId = partyStats[0].partyId;
            let allPlayersInParty = partyStats;
            // If we don't have all players from this party in our stats, we need to calculate pot differently
            const playersInParty = allPlayersInParty.length;
            // Calculate total cost for this party
            const totalBuyins = playersInParty * 5; // Initial buy-in is 5€ per player
            const totalRebuys = allPlayersInParty.reduce((sum, player) => sum + player.rebuys, 0) * 4; // Each rebuy adds 4€
            const totalPot = totalBuyins + totalRebuys;
            // Calculate player's cost (initial buy-in + rebuys)
            const playerStats = partyStats.find(s => s.playerId === Number(playerId));
            if (!playerStats)
                return;
            const playerCost = 5 + (playerStats.rebuys * 4); // Initial buy-in (5€) + rebuys (4€ each)
            // Calculate gain based on position and player count
            let percentage = 0;
            const position = playerStats.position;
            if (!position || position > 4) {
                // Player didn't finish in money - just subtract their costs
                totalGains -= playerCost;
                return;
            }
            if (playersInParty <= 6) {
                // 6 players or less: 1st (65%), 2nd (35%)
                const percentages = [0.65, 0.35, 0, 0];
                percentage = percentages[position - 1];
            }
            else if (playersInParty === 7) {
                // 7 players: 1st (55%), 2nd (30%), 3rd (15%)
                const percentages = [0.55, 0.30, 0.15, 0];
                percentage = percentages[position - 1];
            }
            else {
                // 8 or more players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
                const percentages = [0.50, 0.28, 0.15, 0.07];
                percentage = percentages[position - 1];
            }
            // Calculate prize money and add it to total gains
            const prize = totalPot * percentage;
            totalGains += prize - playerCost;
        });
        return Math.round(totalGains * 100) / 100; // Round to 2 decimal places
    }
    useEffect(() => {
        const fetchPlayerStats = async () => {
            if (!playerId)
                return;
            try {
                setIsLoading(true);
                // Fetch player stats
                const response = await api.get(`/playerStats/${playerId}`);
                const { stats, totalPoints: apiTotalPoints, totalKills: apiTotalKills } = response.data;
                if (!stats.length) {
                    setError('No stats found for this player');
                    setIsLoading(false);
                    return;
                }
                // Collect all unique party IDs
                const partyIds = [...new Set(stats.map((stat) => stat.partyId))];
                // Fetch party details for each party to get accurate player counts
                const partyDataPromises = partyIds.map(partyId => api.get(`/playerStatsByParty/${partyId}`)
                    .then(res => res.data)
                    .catch(err => {
                    console.error(`Error fetching party data for party ${partyId}:`, err);
                    return null;
                }));
                const partyDataResults = await Promise.all(partyDataPromises);
                // Create a map of party ID to player count
                const partyPlayerCounts = {};
                partyDataResults.forEach(partyData => {
                    if (partyData && partyData.id && partyData.playerStats) {
                        partyPlayerCounts[partyData.id] = partyData.playerStats.length;
                    }
                });
                // Enhance stats with party player counts
                const enhancedStats = stats.map((stat) => {
                    const playerCount = partyPlayerCounts[stat.partyId] || 8; // Default to 8 if we couldn't fetch the data
                    // Calculate player's cost
                    const playerCost = 5 + (stat.rebuys * 4);
                    // Calculate game gains based on the new formula
                    let gain = -playerCost; // Default to losing the buy-in
                    const position = stat.position;
                    if (position && position <= 4) {
                        // Calculate percentage based on position and player count
                        let percentage = 0;
                        if (playerCount <= 6) {
                            // 6 players or less: 1st (65%), 2nd (35%)
                            const percentages = [0.65, 0.35, 0, 0];
                            percentage = percentages[position - 1];
                        }
                        else if (playerCount === 7) {
                            // 7 players: 1st (55%), 2nd (30%), 3rd (15%)
                            const percentages = [0.55, 0.30, 0.15, 0];
                            percentage = percentages[position - 1];
                        }
                        else {
                            // 8 or more players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
                            const percentages = [0.50, 0.28, 0.15, 0.07];
                            percentage = percentages[position - 1];
                        }
                        // Calculate total pot (estimated)
                        const totalBuyins = playerCount * 5;
                        // We don't know the exact rebuy count for the entire party, so we estimate
                        // For simplicity, we'll assume an average of 0.5 rebuys per player
                        const estimatedTotalRebuys = playerCount * 0.5 * 4;
                        const estimatedTotalPot = totalBuyins + estimatedTotalRebuys;
                        // Calculate prize
                        const prize = estimatedTotalPot * percentage;
                        gain = prize - playerCost;
                    }
                    // Update the gains property with our calculated value
                    return {
                        ...stat,
                        gains: Math.round(gain * 100) / 100,
                        playerCount
                    };
                });
                // Group stats by year
                const statsByYear = enhancedStats.reduce((acc, stat) => {
                    const year = new Date(stat.createdAt).getFullYear();
                    if (!acc[year])
                        acc[year] = [];
                    acc[year].push(stat);
                    return acc;
                }, {});
                // Calculate yearly statistics
                const yearlyStats = Object.entries(statsByYear).map(([year, yearStats]) => {
                    // Use type assertion to inform TypeScript about the type
                    const typedYearStats = yearStats;
                    const totalPoints = typedYearStats.reduce((sum, stat) => sum + stat.points, 0);
                    const totalKills = typedYearStats.reduce((sum, stat) => sum + stat.kills, 0);
                    const totalRebuys = typedYearStats.reduce((sum, stat) => sum + stat.rebuys, 0);
                    // Use the new gain calculation for yearly stats
                    const totalGains = calculateGains(typedYearStats);
                    const positionSum = typedYearStats.reduce((sum, stat) => sum + (stat.position || 0), 0);
                    const gamesPlayed = typedYearStats.length;
                    const averagePosition = gamesPlayed ? positionSum / gamesPlayed : 0;
                    const winCount = typedYearStats.filter((stat) => stat.position === 1).length;
                    return {
                        year: parseInt(year),
                        stats: typedYearStats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
                        totalPoints,
                        totalGains,
                        totalKills,
                        totalRebuys,
                        averagePosition,
                        gamesPlayed,
                        winCount,
                    };
                }).sort((a, b) => b.year - a.year);
                // Calculate overall statistics
                const totalGames = yearlyStats.reduce((sum, year) => sum + year.gamesPlayed, 0);
                const totalWins = yearlyStats.reduce((sum, year) => sum + year.winCount, 0);
                const winRate = totalGames ? (totalWins / totalGames) * 100 : 0;
                const totalGains = yearlyStats.reduce((sum, year) => sum + (year.totalGains || 0), 0);
                // Calculate average position across all games
                const positionSum = stats.reduce((sum, stat) => sum + (stat.position || 0), 0);
                const averagePosition = stats.length ? positionSum / stats.length : 0;
                const playerData = {
                    player: stats[0].player,
                    yearlyStats,
                    totalPoints: apiTotalPoints,
                    totalGains,
                    totalKills: apiTotalKills,
                    totalGames,
                    winRate,
                    averagePosition,
                };
                setPlayerStats(playerData);
                // Set default selected year if not already set
                if (yearlyStats.length && !selectedYear) {
                    setSelectedYear(yearlyStats[0].year);
                }
            }
            catch (err) {
                console.error('Error fetching player stats:', err);
                setError('Failed to load player statistics');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchPlayerStats();
    }, [playerId]);
    if (isLoading) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-slate-900", children: _jsx("div", { className: "text-amber-400 text-xl", children: "Loading..." }) }));
    }
    if (error || !playerStats) {
        return (_jsx("div", { className: "flex h-screen items-center justify-center bg-slate-900", children: _jsx("div", { className: "text-red-400 text-xl", children: error || 'No player data found' }) }));
    }
    const { player, yearlyStats, totalPoints, totalGains, totalKills, totalGames, winRate, averagePosition } = playerStats;
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 p-5", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-amber-400 mb-2", children: player.name }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Total Points" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold text-amber-400", children: totalPoints }) })] }), _jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Total Profit/Loss" }) }), _jsx(CardContent, { children: _jsxs("p", { className: cn("text-2xl font-bold", totalGains >= 0 ? "text-green-400" : "text-red-400"), children: [totalGains >= 0 ? `+${totalGains}` : totalGains, "\u20AC"] }) })] }), _jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Win Rate" }) }), _jsxs(CardContent, { children: [_jsxs("p", { className: "text-2xl font-bold text-amber-400", children: [winRate.toFixed(1), "%"] }), _jsxs("p", { className: "text-xs text-slate-400", children: [totalGames, " games played"] })] })] }), _jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Avg. Position" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-2xl font-bold text-amber-400", children: averagePosition.toFixed(1) }), _jsxs("p", { className: "text-xs text-slate-400", children: [totalKills, " total kills"] })] })] })] })] }), _jsxs(Tabs, { defaultValue: String(selectedYear), className: "mb-4", onValueChange: (value) => setSelectedYear(Number(value)), children: [_jsx(TabsList, { className: "grid w-full grid-cols-3 bg-slate-800/50 p-0.5 rounded-lg", children: years.map(year => (_jsx(TabsTrigger, { value: year.toString(), className: cn("font-['DS-DIGI']", "text-3xl xl:text-base", "h-8", "data-[state=active]:bg-amber-500/10", "data-[state=active]:text-amber-400", "data-[state=active]:shadow-[0_0_10px_rgba(245,158,11,0.1)]", "text-slate-400", "transition-all"), children: year }, year))) }), years.map(year => {
                        // Find stats for this year, if we have playerStats
                        const yearStat = playerStats?.yearlyStats?.find(stat => stat.year === year);
                        return (_jsx(TabsContent, { value: year.toString(), className: "mt-6", children: yearStat ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Games Played" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold text-amber-400", children: yearStat.gamesPlayed }) })] }), _jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Wins" }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-2xl font-bold text-amber-400", children: yearStat.winCount }), _jsx("p", { className: "text-xs text-slate-400", children: yearStat.gamesPlayed > 0 ? `${((yearStat.winCount / yearStat.gamesPlayed) * 100).toFixed(1)}%` : '0%' })] })] }), _jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Year Points" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold text-amber-400", children: yearStat.totalPoints }) })] }), _jsxs(Card, { className: "bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]", children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm text-slate-400", children: "Profit/Loss" }) }), _jsx(CardContent, { children: _jsxs("p", { className: cn("text-2xl font-bold", yearStat.totalGains >= 0 ? "text-green-400" : "text-red-400"), children: [yearStat.totalGains >= 0 ? `+${yearStat.totalGains}` : yearStat.totalGains, "\u20AC"] }) })] })] }), _jsx("div", { className: "overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Date" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Position" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Points" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Rebuys" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Kills" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Out Time" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Gains" })] }) }), _jsx("tbody", { children: yearStat.stats.map((stat) => {
                                                        // Get player count from the enhanced data
                                                        const playerCount = stat.playerCount || 8;
                                                        // Get the gain directly from the enhanced data
                                                        const gain = stat.gains !== undefined ? stat.gains : 0;
                                                        return (_jsxs("tr", { className: "hover:bg-blue-900/80 transition-colors", children: [_jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: new Date(stat.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.position ? `${stat.position}${getPositionSuffix(stat.position)}` : 'N/A' }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.points }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.rebuys }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.kills }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.outAt
                                                                        ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                                        : 'N/A' }), _jsxs("td", { className: cn("px-3 py-3 text-sm font-semibold border-b border-amber-400/20", gain >= 0 ? "text-green-400" : "text-red-400"), children: [gain >= 0 ? `+${gain}` : gain, "\u20AC"] })] }, stat.id));
                                                    }) })] }) })] })) : (_jsxs("div", { className: "text-center py-8", children: [_jsxs("p", { className: "text-amber-400 text-lg", children: ["No tournament data for ", year] }), _jsx("p", { className: "text-amber-400/60 text-sm mt-2", children: "This player didn't participate in any tournaments this year" })] })) }, year));
                    })] })] }));
};
// Helper function to get the correct suffix for position numbers
function getPositionSuffix(position) {
    if (position >= 11 && position <= 13) {
        return 'th';
    }
    switch (position % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}
export default PlayerPage;
