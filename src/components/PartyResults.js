import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import PlayerTable from "./PlayerTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { cn } from "../lib/utils";
import { useRecentTournamentYears } from "../hooks/useRecentTournamentYears";
import { calculateGains, calculatePlayerCost, calculateTotalPot, getBubblePosition, } from "../utils/gainsCalculator";
function calculateTotalGains(playerStats) {
    // Group stats by party
    const statsByParty = {};
    playerStats.forEach(stat => {
        const partyId = stat.partyId || 'unknown';
        if (!statsByParty[partyId]) {
            statsByParty[partyId] = [];
        }
        statsByParty[partyId].push(stat);
    });
    // Calculate total gains across all parties
    let totalGains = 0;
    Object.values(statsByParty).forEach(partyStats => {
        // Calculate total pot for this party
        const playerCount = partyStats.length;
        const totalRebuys = partyStats.reduce((sum, player) => sum + player.rebuys, 0);
        const totalPot = calculateTotalPot(playerCount, totalRebuys);
        // Find this player's stats
        const playerStat = partyStats.find(stat => stat.playerId === playerStats[0].playerId);
        if (!playerStat)
            return;
        // Calculate player's cost
        const playerCost = calculatePlayerCost(playerStat.rebuys);
        const gains = calculateGains(playerStat.position, playerCount, totalPot, playerCost, totalRebuys);
        totalGains += gains;
    });
    return Math.round(totalGains * 100) / 100; // Round to 2 decimal places
}
const PartyResults = ({ players }) => {
    // Group configs by year for better organization
    const { years, defaultYear } = useRecentTournamentYears();
    const [selectedYear, setSelectedYear] = useState(null);
    const activeYear = selectedYear ?? defaultYear;
    const categories = ["Points", "Gains", "Recave", "Moneydown", "Killer", "Bule"];
    const partyTotals = useMemo(() => {
        const partyPlayers = new Map();
        players.forEach(player => {
            player.stats?.forEach(stat => {
                if (stat.partyId == null)
                    return;
                const existing = partyPlayers.get(stat.partyId) ?? { playerIds: new Set(), totalRebuys: 0 };
                existing.playerIds.add(stat.playerId);
                existing.totalRebuys += stat.rebuys || 0;
                partyPlayers.set(stat.partyId, existing);
            });
        });
        const totals = new Map();
        partyPlayers.forEach((partyData, partyId) => {
            totals.set(partyId, {
                playerCount: partyData.playerIds.size,
                totalRebuys: partyData.totalRebuys,
            });
        });
        return totals;
    }, [players]);
    useEffect(() => {
        if (defaultYear && selectedYear === null) {
            setSelectedYear(defaultYear);
        }
    }, [defaultYear, selectedYear]);
    const tableConfigs = years.flatMap(year => categories.map(category => ({
        title: `${category} ${year}`,
        filterFunction: (playerStat) => {
            const filteredStats = playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === year);
            switch (category) {
                case "Points":
                    return filteredStats.some(game => game.points > 1);
                case "Gains":
                    return calculateTotalGains(filteredStats) > 0;
                case "Recave":
                    return filteredStats.some(stat => stat.rebuys > 0);
                case "Moneydown":
                    return filteredStats.some(stat => stat.totalCost > 5);
                case "Killer":
                    return filteredStats.some(stat => stat.kills > 0);
                case "Bule":
                    return filteredStats.some(stat => {
                        const partyTotal = partyTotals.get(stat.partyId ?? -1);
                        const bubblePosition = getBubblePosition(partyTotal?.playerCount ?? 0, partyTotal?.totalRebuys ?? 0);
                        return bubblePosition !== null && stat.position === bubblePosition;
                    });
                default:
                    return false;
            }
        },
        rankFunction: (playerStat) => {
            const filteredStats = playerStat.filter(stat => new Date(stat.createdAt).getFullYear() === year);
            switch (category) {
                case "Points":
                    return filteredStats.reduce((total, game) => total + game.points, 0);
                case "Gains":
                    return calculateTotalGains(filteredStats);
                case "Recave":
                    return filteredStats.reduce((total, stat) => total + stat.rebuys, 0);
                case "Moneydown":
                    return filteredStats.reduce((total, stat) => total + stat.totalCost, 0);
                case "Killer":
                    return filteredStats.reduce((total, stat) => total + stat.kills, 0);
                case "Bule":
                    return filteredStats.reduce((total, stat) => {
                        const partyTotal = partyTotals.get(stat.partyId ?? -1);
                        const bubblePosition = getBubblePosition(partyTotal?.playerCount ?? 0, partyTotal?.totalRebuys ?? 0);
                        return bubblePosition !== null && stat.position === bubblePosition ? total + 1 : total;
                    }, 0);
                default:
                    return 0;
            }
        },
    })));
    return (_jsx("div", { className: "w-full px-1 bg-slate-950", children: _jsxs(Tabs, { value: activeYear ? activeYear.toString() : "", onValueChange: (value) => {
                const year = Number(value);
                if (!Number.isNaN(year)) {
                    setSelectedYear(year);
                }
            }, className: "w-full", children: [_jsx(TabsList, { className: "grid w-full grid-cols-3 mb-2 bg-slate-800/50 p-0.5 rounded-lg", children: years.map(year => (_jsx(TabsTrigger, { value: year.toString(), className: cn("font-['DS-DIGI']", "text-3xl xl:text-base", "h-8", "data-[state=active]:bg-amber-500/10", "data-[state=active]:text-amber-400", "data-[state=active]:shadow-[0_0_10px_rgba(245,158,11,0.1)]", "text-slate-400", "transition-all"), children: year }, year))) }), years.map(year => (_jsx(TabsContent, { value: year.toString(), className: cn("grid gap-2", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3"), children: categories.map(category => {
                        const config = tableConfigs.find(c => c.title === `${category} ${year}`);
                        if (!config)
                            return null;
                        return (_jsxs(Card, { className: cn("transition-all duration-300", "border-0", "shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]", "hover:shadow-[0_8px_20px_-4px_rgba(0,0,0,0.4)]", "bg-slate-900/90 backdrop-blur-sm", "overflow-hidden rounded-lg"), children: [_jsx(CardHeader, { className: "py-2.5 px-3 border-b border-slate-700/50 bg-gradient-to-r from-amber-500/10 via-slate-800 to-slate-800", children: _jsx(CardTitle, { className: cn("font-['DS-DIGI']", "text-base lg:text-xl", "text-amber-400", "tracking-wide"), children: category }) }), _jsx(CardContent, { className: "p-0", children: _jsx(PlayerTable, { "aria-label": `${category} ${year} results`, config: config, players: players }) })] }, category));
                    }) }, year)))] }) }));
};
export default PartyResults;
