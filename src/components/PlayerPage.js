import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "../lib/utils";
import { calculatePartyGains } from '../utils/gainsCalculator';
// Custom component to display a statistic with a label and value
const StatCard = ({ title, value, className = "" }) => (_jsxs(Card, { className: cn("bg-slate-900 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.05)]", className), children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-amber-400 text-sm font-normal", children: title }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-2xl font-bold text-white", children: value }) })] }));
// Helper function for position suffixes
// const getPositionSuffix = (position: number): string => {
//     if (position === 1) return 'st';
//     if (position === 2) return 'nd';
//     if (position === 3) return 'rd';
//     return 'th';
// };
export const PlayerPage = () => {
    const { playerId } = useParams();
    const [playerStats, setPlayerStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(2025);
    const years = [2023, 2024, 2025];
    useEffect(() => {
        const fetchPlayerStats = async () => {
            if (!playerId)
                return;
            try {
                setIsLoading(true);
                // Fetch player stats
                const response = await api.get(`/playerStats/${playerId}`);
                const { stats, } = response.data;
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
                // Create a map of party ID to player stats
                const partyStatsMap = {};
                partyDataResults.forEach(partyData => {
                    if (partyData && partyData.id && partyData.playerStats) {
                        partyStatsMap[partyData.id] = partyData.playerStats;
                    }
                });
                // Enhance stats with party player counts and proper gain calculations
                const enhancedStats = stats.map((stat) => {
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
                    // Use the actual gains from our enhanced stats
                    const totalGains = typedYearStats.reduce((sum, stat) => sum + stat.gains, 0);
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
                const totalGains = yearlyStats.reduce((sum, year) => sum + year.totalGains, 0);
                const totalWins = yearlyStats.reduce((sum, year) => sum + year.winCount, 0);
                const totalPoints = yearlyStats.reduce((sum, year) => sum + year.totalPoints, 0);
                const totalKills = yearlyStats.reduce((sum, year) => sum + year.totalKills, 0);
                const totalRebuys = yearlyStats.reduce((sum, year) => sum + year.totalRebuys, 0);
                const totalPositionSum = yearlyStats.reduce((sum, year) => sum + (year.averagePosition * year.gamesPlayed), 0);
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
            }
            catch (error) {
                console.error("Error fetching player statistics:", error);
                setError("Failed to load player data. Please try again.");
                setIsLoading(false);
            }
        };
        fetchPlayerStats();
    }, [playerId]);
    return (_jsx("div", { className: "p-5 min-h-screen bg-slate-900", children: isLoading ? (_jsx("div", { className: "flex justify-center items-center min-h-[50vh]", children: _jsx("div", { className: "text-amber-400 text-xl", children: "Loading player data..." }) })) : error ? (_jsx("div", { className: "flex justify-center items-center min-h-[50vh]", children: _jsx("div", { className: "text-red-500 text-xl", children: error }) })) : playerStats ? (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-amber-400 mb-6", children: playerStats.name }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [_jsx(StatCard, { title: "Total Points", value: playerStats.totalPoints }), _jsx(StatCard, { title: "Wins", value: playerStats.winCount }), _jsx(StatCard, { title: "Profit/Loss", value: `${playerStats.totalGains >= 0 ? '+' : ''}${playerStats.totalGains.toFixed(2)} €`, className: playerStats.totalGains >= 0 ? "border-green-500/30" : "border-red-500/30" }), _jsx(StatCard, { title: "Avg Position", value: playerStats.averagePosition.toFixed(1) })] }), _jsx(Tabs, { defaultValue: "2025", className: "mb-4", children: _jsx(TabsList, { className: "grid w-full grid-cols-3 bg-slate-800/50 p-0.5 rounded-lg", children: years.map(year => (_jsx(TabsTrigger, { value: year.toString(), onClick: () => setSelectedYear(year), className: cn("font-['DS-DIGI']", "text-3xl xl:text-base", "h-8", "data-[state=active]:bg-amber-500/10", "data-[state=active]:text-amber-400", "data-[state=active]:shadow-[0_0_10px_rgba(245,158,11,0.1)]", "text-slate-400", "transition-all"), children: year }, year))) }) }), years.map(year => {
                    const yearData = playerStats.yearlyStats.find(y => y.year === year);
                    return (_jsx("div", { className: selectedYear === year ? "block" : "hidden", children: yearData ? (_jsxs("div", { children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: [_jsx(StatCard, { title: `${year} Points`, value: yearData.totalPoints }), _jsx(StatCard, { title: `${year} Wins`, value: yearData.winCount }), _jsx(StatCard, { title: `${year} Profit/Loss`, value: `${yearData.totalGains >= 0 ? '+' : ''}${yearData.totalGains.toFixed(2)} €`, className: yearData.totalGains >= 0 ? "border-green-500/30" : "border-red-500/30" }), _jsx(StatCard, { title: `${year} Avg Position`, value: yearData.averagePosition.toFixed(1) })] }), _jsx("div", { className: "mt-8 overflow-hidden rounded-[5px] border border-amber-400 bg-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Date" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Position" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Players" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Rebuys" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Kills" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Out Time" }), _jsx("th", { className: "px-3 py-3 text-left text-sm font-semibold bg-blue-900/90 text-amber-400 border-b border-amber-400", children: "Gains" })] }) }), _jsx("tbody", { children: yearData.stats.map(stat => (_jsxs("tr", { className: "hover:bg-blue-900/80 transition-colors", children: [_jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: new Date(stat.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.position || 'N/A' }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.playerCount || 'N/A' }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.rebuys }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.kills }), _jsx("td", { className: "px-3 py-3 text-sm text-amber-400 border-b border-amber-400/20", children: stat.outAt
                                                                ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                                                : 'N/A' }), _jsxs("td", { className: cn("px-3 py-3 text-sm font-semibold border-b border-amber-400/20", stat.gains >= 0 ? "text-green-400" : "text-red-400"), children: [stat.gains >= 0 ? `+${stat.gains}` : stat.gains, "\u20AC"] })] }, stat.id))) })] }) })] })) : (_jsx("div", { className: "flex justify-center items-center min-h-[30vh]", children: _jsxs("div", { className: "text-slate-400 text-xl", children: ["No data for ", year] }) })) }, year));
                })] })) : null }));
};
export default PlayerPage;
