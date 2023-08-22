import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import api from '../api'; // replace with your actual API import
function calculateGains(playerStats) {
    return playerStats.reduce((sum, game) => {
        let gain = 0;
        if (game.position === 1)
            gain = game.totalCost * 0.6;
        else if (game.position === 2)
            gain = game.totalCost * 0.3;
        else if (game.position === 3)
            gain = game.totalCost * 0.1;
        return sum + Math.round(gain);
    }, 0);
}
export const PartyPage = () => {
    const [parties, setParties] = useState([]);
    useEffect(() => {
        const fetchParties = async () => {
            const response = await api.get("/parties");
            const allParties = response.data;
            // Fetch detailed stats for each party
            const partiesWithStats = await Promise.all(allParties.map(async (party) => {
                const statsResponse = await api.get(`/parties/${party.id}/stats`);
                return {
                    ...party,
                    playerStats: statsResponse.data,
                };
            }));
            setParties(partiesWithStats);
        };
        fetchParties();
    }, []);
    console.log("parties", parties);
    return (_jsx("div", { children: parties.map((party, i) => (_jsxs("div", { style: { marginBottom: '20px' }, children: [_jsx("div", { style: { marginLeft: 10, fontWeight: 'bold' }, children: new Date(party.date).toLocaleDateString() }), _jsxs(Table, { style: { padding: 10, width: '100%' }, children: [_jsxs(TableHeader, { children: [_jsx(TableColumn, { children: "Player" }), _jsx(TableColumn, { children: "Position" }), _jsx(TableColumn, { children: "Points" }), _jsx(TableColumn, { children: "Rebuys" }), _jsx(TableColumn, { children: "Sortie" }), _jsx(TableColumn, { children: "Gains" })] }), _jsx(TableBody, { children: party.playerStats.map((stat, i) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: stat.player.name }), _jsx(TableCell, { children: stat.position }), _jsx(TableCell, { children: stat.points }), _jsx(TableCell, { children: stat.rebuys }), _jsx(TableCell, { children: stat.outAt
                                            ? `${new Date(stat.outAt).getHours().toString().padStart(2, '0')}:${new Date(stat.outAt).getMinutes().toString().padStart(2, '0')}:${new Date(stat.outAt).getSeconds().toString().padStart(2, '0')}`
                                            : 'N/A' }), _jsx(TableCell, { children: stat.gains })] }, i))) })] })] }, i))) }));
};
export default PartyPage;
//# sourceMappingURL=PartyPage.js.map