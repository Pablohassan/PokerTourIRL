import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Player, PlayerStats } from './interfaces';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { cn } from '../lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface YearlyStats {
    year: number;
    stats: PlayerStats[];
    totalPoints: number;
    totalGains: number;
    totalKills: number;
    averagePosition: number;
    gamesPlayed: number;
    winCount: number;
    totalRebuys: number;
}

interface DetailedPlayerStats {
    player: Player;
    yearlyStats: YearlyStats[];
    totalPoints: number;
    totalGains: number;
    totalKills: number;
    totalGames: number;
    winRate: number;
    averagePosition: number;
}

export const PlayerPage = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const [playerStats, setPlayerStats] = useState<DetailedPlayerStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const years = [2023, 2024, 2025];

    /**
     * Calculates player gains based on position and total number of players.
     * 
     * Prize distribution rules:
     * - 6 players or less: 1st (65%), 2nd (35%)
     * - 7 players: 1st (55%), 2nd (30%), 3rd (15%)
     * - 8+ players: 1st (50%), 2nd (28%), 3rd (15%), 4th (7%)
     */
    function calculateGains(stats: PlayerStats[]): number {
        if (!playerId) return 0;

        // Group stats by party
        const statsByParty: Record<number, PlayerStats[]> = {};

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

            let allPlayersInParty: PlayerStats[] = partyStats;

            // If we don't have all players from this party in our stats, we need to calculate pot differently
            const playersInParty = allPlayersInParty.length;

            // Calculate total cost for this party
            const totalBuyins = playersInParty * 5; // Initial buy-in is 5€ per player
            const totalRebuys = allPlayersInParty.reduce((sum, player) => sum + player.rebuys, 0) * 4; // Each rebuy adds 4€
            const totalPot = totalBuyins + totalRebuys;

            // Calculate player's cost (initial buy-in + rebuys)
            const playerStats = partyStats.find(s => s.playerId === Number(playerId));
            if (!playerStats) return;

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
            } else if (playersInParty === 7) {
                // 7 players: 1st (55%), 2nd (30%), 3rd (15%)
                const percentages = [0.55, 0.30, 0.15, 0];
                percentage = percentages[position - 1];
            } else {
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
            if (!playerId) return;

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
                const partyIds = [...new Set(stats.map((stat: PlayerStats) => stat.partyId))];

                // Fetch party details for each party to get accurate player counts
                const partyDataPromises = partyIds.map(partyId =>
                    api.get(`/playerStatsByParty/${partyId}`)
                        .then(res => res.data)
                        .catch(err => {
                            console.error(`Error fetching party data for party ${partyId}:`, err);
                            return null;
                        })
                );

                const partyDataResults = await Promise.all(partyDataPromises);

                // Create a map of party ID to player count
                const partyPlayerCounts: Record<number, number> = {};
                partyDataResults.forEach(partyData => {
                    if (partyData && partyData.id && partyData.playerStats) {
                        partyPlayerCounts[partyData.id] = partyData.playerStats.length;
                    }
                });

                // Enhance stats with party player counts
                const enhancedStats = stats.map((stat: PlayerStats) => {
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
                        } else if (playerCount === 7) {
                            // 7 players: 1st (55%), 2nd (30%), 3rd (15%)
                            const percentages = [0.55, 0.30, 0.15, 0];
                            percentage = percentages[position - 1];
                        } else {
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
                const statsByYear = enhancedStats.reduce((acc: Record<number, PlayerStats[]>, stat: PlayerStats) => {
                    const year = new Date(stat.createdAt).getFullYear();
                    if (!acc[year]) acc[year] = [];
                    acc[year].push(stat);
                    return acc;
                }, {});

                // Calculate yearly statistics
                const yearlyStats = Object.entries(statsByYear).map(([year, yearStats]) => {
                    // Use type assertion to inform TypeScript about the type
                    const typedYearStats = yearStats as PlayerStats[];

                    const totalPoints = typedYearStats.reduce((sum: number, stat: PlayerStats) => sum + stat.points, 0);
                    const totalKills = typedYearStats.reduce((sum: number, stat: PlayerStats) => sum + stat.kills, 0);
                    const totalRebuys = typedYearStats.reduce((sum: number, stat: PlayerStats) => sum + stat.rebuys, 0);

                    // Use the new gain calculation for yearly stats
                    const totalGains = calculateGains(typedYearStats);

                    const positionSum = typedYearStats.reduce((sum: number, stat: PlayerStats) => sum + (stat.position || 0), 0);
                    const gamesPlayed = typedYearStats.length;
                    const averagePosition = gamesPlayed ? positionSum / gamesPlayed : 0;
                    const winCount = typedYearStats.filter((stat: PlayerStats) => stat.position === 1).length;

                    return {
                        year: parseInt(year),
                        stats: typedYearStats.sort((a: PlayerStats, b: PlayerStats) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
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
                const totalGames = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.gamesPlayed, 0);
                const totalWins = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.winCount, 0);
                const winRate = totalGames ? (totalWins / totalGames) * 100 : 0;
                const totalGains = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + (year.totalGains || 0), 0);

                // Calculate average position across all games
                const positionSum = stats.reduce((sum: number, stat: PlayerStats) => sum + (stat.position || 0), 0);
                const averagePosition = stats.length ? positionSum / stats.length : 0;

                const playerData: DetailedPlayerStats = {
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
            } catch (err) {
                console.error('Error fetching player stats:', err);
                setError('Failed to load player statistics');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlayerStats();
    }, [playerId]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <div className="text-amber-400 text-xl">Loading...</div>
            </div>
        );
    }

    if (error || !playerStats) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <div className="text-red-400 text-xl">{error || 'No player data found'}</div>
            </div>
        );
    }

    const { player, totalPoints, totalGains, totalKills, totalGames, winRate, averagePosition } = playerStats;

    return (
        <div className="min-h-screen bg-slate-900 p-5">
            {/* Player Profile Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-amber-400 mb-2">{player.name}</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400">Total Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-amber-400">{totalPoints}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400">Total Profit/Loss</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={cn(
                                "text-2xl font-bold",
                                totalGains >= 0 ? "text-green-400" : "text-red-400"
                            )}>
                                {totalGains >= 0 ? `+${totalGains}` : totalGains}€
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400">Win Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-amber-400">{winRate.toFixed(1)}%</p>
                            <p className="text-xs text-slate-400">{totalGames} games played</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm text-slate-400">Avg. Position</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-amber-400">{averagePosition.toFixed(1)}</p>
                            <p className="text-xs text-slate-400">{totalKills} total kills</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Yearly Stats Tabs */}
            <Tabs
                defaultValue={String(selectedYear)}
                className="mb-4"
                onValueChange={(value) => setSelectedYear(Number(value))}
            >
                <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-0.5 rounded-lg">
                    {years.map(year => (
                        <TabsTrigger
                            key={year}
                            value={year.toString()}
                            className={cn(
                                "font-['DS-DIGI']",
                                "text-3xl xl:text-base",
                                "h-8",
                                "data-[state=active]:bg-amber-500/10",
                                "data-[state=active]:text-amber-400",
                                "data-[state=active]:shadow-[0_0_10px_rgba(245,158,11,0.1)]",
                                "text-slate-400",
                                "transition-all"
                            )}
                        >
                            {year}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {years.map(year => {
                    // Find stats for this year, if we have playerStats
                    const yearStat = playerStats?.yearlyStats?.find(stat => stat.year === year);

                    return (
                        <TabsContent key={year} value={year.toString()} className="mt-6">
                            {yearStat ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm text-slate-400">Games Played</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-amber-400">{yearStat.gamesPlayed}</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm text-slate-400">Wins</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-amber-400">{yearStat.winCount}</p>
                                                <p className="text-xs text-slate-400">
                                                    {yearStat.gamesPlayed > 0 ? `${((yearStat.winCount / yearStat.gamesPlayed) * 100).toFixed(1)}%` : '0%'}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm text-slate-400">Year Points</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-2xl font-bold text-amber-400">{yearStat.totalPoints}</p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-slate-800 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm text-slate-400">Profit/Loss</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className={cn(
                                                    "text-2xl font-bold",
                                                    yearStat.totalGains >= 0 ? "text-green-400" : "text-red-400"
                                                )}>
                                                    {yearStat.totalGains >= 0 ? `+${yearStat.totalGains}` : yearStat.totalGains}€
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Tournament history table */}
                                    <div className="overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                        <table className="w-full">
                                            <thead>
                                                <tr>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Date</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Position</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Points</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Rebuys</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Kills</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Out Time</th>
                                                    <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Gains</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {yearStat.stats.map((stat) => {
                                                    // Get player count from the enhanced data
                                                    //           const playerCount = (stat as any).playerCount || 8;

                                                    // Get the gain directly from the enhanced data
                                                    const gain = stat.gains !== undefined ? stat.gains : 0;

                                                    return (
                                                        <tr key={stat.id} className="hover:bg-blue-900/80 transition-colors">
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {new Date(stat.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.position ? `${stat.position}${getPositionSuffix(stat.position)}` : 'N/A'}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.points}</td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.rebuys}</td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">{stat.kills}</td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.outAt
                                                                    ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                                    : 'N/A'}
                                                            </td>
                                                            <td className={cn(
                                                                "px-3 py-3 text-sm font-semibold border-b border-amber-400/20",
                                                                gain >= 0 ? "text-green-400" : "text-red-400"
                                                            )}>
                                                                {gain >= 0 ? `+${gain}` : gain}€
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-amber-400 text-lg">No tournament data for {year}</p>
                                    <p className="text-amber-400/60 text-sm mt-2">This player didn't participate in any tournaments this year</p>
                                </div>
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
    );
};

// Helper function to get the correct suffix for position numbers
function getPositionSuffix(position: number): string {
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