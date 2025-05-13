import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";
import { calculatePartyGains } from '../utils/gainsCalculator';

// Define or extend the PlayerStats interface
interface PlayerStats {
    id: number;
    playerId: number;
    partyId: number;
    position: number;
    points: number;
    rebuys: number;
    kills: number;
    outAt: string;
    createdAt: string;
    updatedAt: string;
    gains: number;
    player: { id: number; name: string };
    playerCount?: number; // Make this optional since we're adding it dynamically
}

// Define additional interfaces for component state
interface DetailedPlayerStats {
    id: number;
    name: string;
    statsByYear: Record<number, PlayerStats[]>;
    yearlyStats: YearlyStats[];
    totalPoints: number;
    totalGains: number;
    totalKills: number;
    totalRebuys: number;
    averagePosition: number;
    gamesPlayed: number;
    winCount: number;
}

interface YearlyStats {
    year: number;
    stats: PlayerStats[];
    totalPoints: number;
    totalGains: number;
    totalKills: number;
    totalRebuys: number;
    averagePosition: number;
    gamesPlayed: number;
    winCount: number;
}

// Custom component to display a statistic with a label and value
const StatCard = ({ title, value, className = "" }: { title: string; value: any; className?: string }) => (
    <Card className={cn("bg-slate-900 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.05)]", className)}>
        <CardHeader className="pb-2">
            <CardTitle className="text-amber-400 text-sm font-normal">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold text-white">{value}</p>
        </CardContent>
    </Card>
);

// Helper function for position suffixes
const getPositionSuffix = (position: number): string => {
    if (position === 1) return 'st';
    if (position === 2) return 'nd';
    if (position === 3) return 'rd';
    return 'th';
};

export const PlayerPage = () => {
    const { playerId } = useParams<{ playerId: string }>();
    const [playerStats, setPlayerStats] = useState<DetailedPlayerStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(2025);
    const years = [2023, 2024, 2025];

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

                // Create a map of party ID to player stats
                const partyStatsMap: Record<number, PlayerStats[]> = {};
                partyDataResults.forEach(partyData => {
                    if (partyData && partyData.id && partyData.playerStats) {
                        partyStatsMap[partyData.id] = partyData.playerStats;
                    }
                });

                // Enhance stats with party player counts and proper gain calculations
                const enhancedStats = stats.map((stat: PlayerStats) => {
                    const partyStats = partyStatsMap[stat.partyId] || [];

                    // Use new utility function to calculate gains properly
                    const gain = calculatePartyGains(partyStats, Number(playerId));

                    // Update the gains property with our calculated value
                    return {
                        ...stat,
                        gains: gain,
                        playerCount: partyStats.length
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

                    // Use the actual gains from our enhanced stats
                    const totalGains = typedYearStats.reduce((sum: number, stat: PlayerStats) => sum + stat.gains, 0);

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
                const totalGains = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.totalGains, 0);
                const totalWins = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.winCount, 0);
                const totalPoints = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.totalPoints, 0);
                const totalKills = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.totalKills, 0);
                const totalRebuys = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + year.totalRebuys, 0);
                const totalPositionSum = yearlyStats.reduce((sum: number, year: YearlyStats) => sum + (year.averagePosition * year.gamesPlayed), 0);
                const averagePosition = totalGames ? totalPositionSum / totalGames : 0;

                // Update state with calculated stats
                setPlayerStats({
                    id: Number(playerId),
                    name: stats[0].player.name,
                    statsByYear,
                    yearlyStats,
                    totalPoints,
                    totalGains,
                    totalKills,
                    totalRebuys,
                    averagePosition,
                    gamesPlayed: totalGames,
                    winCount: totalWins
                });

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching player statistics:", error);
                setError("Failed to load player data. Please try again.");
                setIsLoading(false);
            }
        };

        fetchPlayerStats();
    }, [playerId]);

    return (
        <div className="p-5 min-h-screen bg-slate-900">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="text-amber-400 text-xl">Loading player data...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="text-red-500 text-xl">{error}</div>
                </div>
            ) : playerStats ? (
                <div>
                    <h1 className="text-2xl font-bold text-amber-400 mb-6">{playerStats.name}</h1>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="Total Points"
                            value={playerStats.totalPoints}
                        />
                        <StatCard
                            title="Wins"
                            value={playerStats.winCount}
                        />
                        <StatCard
                            title="Profit/Loss"
                            value={`${playerStats.totalGains >= 0 ? '+' : ''}${playerStats.totalGains.toFixed(2)} €`}
                            className={playerStats.totalGains >= 0 ? "border-green-500/30" : "border-red-500/30"}
                        />
                        <StatCard
                            title="Avg Position"
                            value={playerStats.averagePosition.toFixed(1)}
                        />
                    </div>

                    <Tabs defaultValue="2025" className="mb-4">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 p-0.5 rounded-lg">
                            {years.map(year => (
                                <TabsTrigger
                                    key={year}
                                    value={year.toString()}
                                    onClick={() => setSelectedYear(year)}
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
                    </Tabs>

                    {years.map(year => {
                        const yearData = playerStats.yearlyStats.find(y => y.year === year);
                        return (
                            <div key={year} className={selectedYear === year ? "block" : "hidden"}>
                                {yearData ? (
                                    <div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                            <StatCard
                                                title={`${year} Points`}
                                                value={yearData.totalPoints}
                                            />
                                            <StatCard
                                                title={`${year} Wins`}
                                                value={yearData.winCount}
                                            />
                                            <StatCard
                                                title={`${year} Profit/Loss`}
                                                value={`${yearData.totalGains >= 0 ? '+' : ''}${yearData.totalGains.toFixed(2)} €`}
                                                className={yearData.totalGains >= 0 ? "border-green-500/30" : "border-red-500/30"}
                                            />
                                            <StatCard
                                                title={`${year} Avg Position`}
                                                value={yearData.averagePosition.toFixed(1)}
                                            />
                                        </div>

                                        <div className="mt-8 overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                                            <table className="w-full">
                                                <thead>
                                                    <tr>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Date</th>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Position</th>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Players</th>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Rebuys</th>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Kills</th>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Out Time</th>
                                                        <th className="px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400">Gains</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {yearData.stats.map(stat => (
                                                        <tr key={stat.id} className="hover:bg-blue-900/80 transition-colors">
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {new Date(stat.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.position || 'N/A'}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.playerCount || 'N/A'}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.rebuys}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.kills}
                                                            </td>
                                                            <td className="px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20">
                                                                {stat.outAt
                                                                    ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                                    : 'N/A'}
                                                            </td>
                                                            <td className={cn(
                                                                "px-3 py-3 text-sm font-semibold border-b border-amber-400/20",
                                                                stat.gains >= 0 ? "text-green-400" : "text-red-400"
                                                            )}>
                                                                {stat.gains >= 0 ? `+${stat.gains}` : stat.gains}€
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-center items-center min-h-[30vh]">
                                        <div className="text-slate-400 text-xl">No data for {year}</div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default PlayerPage; 